// import * as Visualive from '@visualive/engine';

import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Change from './undoredo/Change.js';
import XfoHandle from './sceneWidgets/XfoHandle.js';

class SelectionChange extends Change {
  constructor(selectionManager, prevSelection, newSelection) {
    super('SelectionChange');
    this.__selectionManager = selectionManager;
    this.__prevSelection = prevSelection;
    this.__newSelection = newSelection;
  }

  undo() {
    this.__selectionManager.setSelection(this.__prevSelection);
  }

  redo() {
    this.__selectionManager.setSelection(this.__newSelection);
  }

  toJSON(appData) { 
    const j = super.toJSON(appData);

    const itemPaths = [];
    for (let treeItem of this.__newSelection){
      itemPaths.push(treeItem.getPath())
    }
    j.itemPaths = itemPaths;
    return j;
  }

  fromJSON(j, appData) {
    super.fromJSON(j, appData);

    this.__selectionManager = appData.selectionManager;
    this.__prevSelection = new Set(this.__selectionManager.getSelection());

    const newSelection = new Set();
    for (let itemPath of j.itemPaths){
      newSelection.add(appData.scene.getRoot().resolvePath(itemPath, 1));
    }
    this.__newSelection = newSelection;

    this.__selectionManager.setSelection(this.__newSelection);
  }
}

UndoRedoManager.registerChange('SelectionChange', SelectionChange)

class ToggleSelectionVisibility extends Change {
  constructor(selection, state) {
    super('Selection Visibility Change');
    this.selection = selection;
    this.state = state;
    this.do(this.state);
  }

  undo() {
    this.do(!this.state)
  }

  redo() {
    this.do(this.state)
  }

  do(state) {
    for (let treeItem of this.selection){
        treeItem.getParameter('Visible').setValue(state);
    }
  }
}

UndoRedoManager.registerChange('ToggleSelectionVisibility', ToggleSelectionVisibility)

class SelectionManager {
  constructor(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
    this.__selection = new Set();
    this.leadSelection = undefined;
    this.selectionChanged = new Visualive.Signal();
    this.leadSelectionChanged = new Visualive.Signal();

    this.selectionGroup = new Visualive.Group('selection');
    this.selectionGroup.getParameter('InitialXfoMode').setValue(Visualive.Group.INITIAL_XFO_MODES.average);
    // this.selectionGroup.setVisible(false)

    const size = 0.5
    const thickness = size * 0.01
    this.xfoHandle = new XfoHandle(size, thickness);
    this.xfoHandle.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    // this.xfoHandle.showHandles('Translation')
    this.xfoHandle.showHandles('Rotation')
    this.selectionGroup.addChild(this.xfoHandle)
  }

  setRenderer(renderer) {
    console.log("SelectionManager.setRenderer")
    this.__renderer = renderer;
    this.__renderer.addTreeItem(this.selectionGroup);
  }

  updateGizmos(){
    const selection = this.selectionGroup.getParameter('Items').getValue();
    const visible = Array.from(selection).length > 0;
    console.log("updateGizmos:", visible)
    if(Array.from(selection).length > 0)
      this.selectionGroup.recalcInitialXfo();

    // Set the visiblity of the children of the Selection Group
    this.selectionGroup.traverse( item => {
      item.setVisible(visible)
    })
  }

  getSelection(){
    return this.__selection
  }

  setSelection(selection) {
    for (let treeItem of selection){
      if(!this.__selection.has(treeItem)) {
        treeItem.getParameter('Selected').setValue(true);
        this.__selection.add(treeItem);
        this.selectionGroup.addItem(treeItem);
      }
    }
    for (let treeItem of this.__selection){
      if(!selection.has(treeItem)) {
        treeItem.getParameter('Selected').setValue(false);
        this.__selection.delete(treeItem);
        this.selectionGroup.removeItem(treeItem);
      }
    }

    this.updateGizmos();
  }

  __setLeadSelection(treeItem) {
    if(this.leadSelection != treeItem) {
      this.leadSelection = treeItem;
      this.leadSelectionChanged.emit(treeItem);
    }
  }

  toggleItemSelection(treeItem, replaceSelection = true) {
    const prevSelection = new Set(this.__selection);

    // Avoid clearing the selection when we have the
    // item already selected and are deselecting it.
    // (to clear all selection)
    if (replaceSelection && !(this.__selection.size == 1 && this.__selection.has(treeItem))) {

      let clear = true;
      if(this.__selection.has(treeItem)) {
        let count = 1;
        treeItem.traverse((subTreeItem)=>{
          if(this.__selection.has(subTreeItem)) {
            count++;
          }
        })
        // Note: In some cases, the item is currently selected, and
        // its children make up all the selected items. In that case
        // the user intends to deselect the item and all its children.
        // Avoid cleaning here, so the deselection can occur.
        clear = count != this.__selection.size;
      }

      if(clear)
        this.clearSelection(false);
    }

    let sel;
    if(!this.__selection.has(treeItem)) {
      treeItem.getParameter('Selected').setValue(true);
      this.__selection.add(treeItem);
      this.selectionGroup.addItem(treeItem);
      sel = true;
    }
    else {
      treeItem.getParameter('Selected').setValue(false);
      this.__selection.delete(treeItem);
      this.selectionGroup.removeItem(treeItem);
      sel = false;
    }

    if (sel && this.__selection.size === 1) {
      this.__setLeadSelection(treeItem);
    }

    treeItem.traverse((subTreeItem)=>{
      if (sel) {
        if(!this.__selection.has(subTreeItem)) {
          subTreeItem.getParameter('Selected').setValue(true);
          this.__selection.add(subTreeItem);
          this.selectionGroup.addItem(treeItem);
        }
      }
      else {
        if(this.__selection.has(subTreeItem)) {
          subTreeItem.getParameter('Selected').setValue(false);
          this.__selection.delete(subTreeItem);
          this.selectionGroup.removeItem(treeItem);
        }
      }
    })


    if (!sel) {
      if(this.__selection.size === 1)
        this.__setLeadSelection(this.__selection.values().next().value);
      else if(this.__selection.size === 0)
        this.__setLeadSelection();
    }

    const change = new SelectionChange(this, prevSelection, new Set(this.__selection));
    this.undoRedoManager.addChange(change);

    this.updateGizmos();
    this.selectionChanged.emit(this.__selection);
  }

  clearSelection(newChange = true) {
    if (this.__selection.size == 0)
        return false;
    let prevSelection;
    if(newChange) {
       prevSelection = new Set(this.__selection);
    }
    for (let treeItem of this.__selection){
      treeItem.getParameter('Selected').setValue(false);
    }
    this.selectionGroup.clearItems();
    this.__selection.clear();
    if (newChange){
      const change = new SelectionChange(this, prevSelection, this.__selection);
      this.undoRedoManager.addChange(change);
      this.selectionChanged.emit(this.__selection);
    }
    return true;
  }


  selectItems(treeItems, replaceSelection=true) {
    const prevSelection = new Set(this.__selection);

    if (replaceSelection) {
      this.clearSelection(false);
    }

    for(let treeItem of treeItems) {
      const selectedParam = treeItem.getParameter('Selected');

      if (!selectedParam.getValue()) {
        selectedParam.setValue(true);
        this.selectionGroup.addItem(treeItem);
        this.__selection.add(treeItem);

        treeItem.traverse((subTreeItem)=>{
          if(!this.__selection.has(subTreeItem)) {
            subTreeItem.getParameter('Selected').setValue(true);
            this.__selection.add(subTreeItem);
          }
        })
      }
    }

    const change = new SelectionChange(this, prevSelection, new Set(this.__selection));
    this.undoRedoManager.addChange(change);

    if (this.__selection.size === 1) {
      this.__setLeadSelection(this.__selection.values().next().value);
    }
    else if (this.__selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateGizmos();
    this.selectionChanged.emit(this.__selection);
  }

  deselectItems(treeItems) {
    const prevSelection = new Set(this.__selection);

    for(let treeItem of treeItems) {
      const selectedParam = treeItem.getParameter('Selected');

      if (selectedParam.getValue()) {
        selectedParam.setValue(false);
        this.__selection.delete(selectedParam);
        treeItem.traverse((subTreeItem)=>{
          const selectedParam = subTreeItem.getParameter('Selected');
          if(!this.__selection.has(subTreeItem)) {
            selectedParam.setValue(true);
            this.__selection.delete(treeItem);
          }
        })
      }
    }

    const change = new SelectionChange(this, prevSelection, new Set(this.__selection));
    this.undoRedoManager.addChange(change);

    if (this.__selection.size === 1) {
      this.__setLeadSelection(this.__selection.values().next().value);
    }
    else if (this.__selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateGizmos();
    this.selectionChanged.emit(this.__selection);
  }

  toggleSelectionVisiblity(){
    if(this.leadSelection) {
      const state = !this.leadSelection.getVisible();
      const change = new ToggleSelectionVisibility(this.__selection, state);
      this.undoRedoManager.addChange(change);
    }
  }

}

export default SelectionManager;

export {
  SelectionManager
}