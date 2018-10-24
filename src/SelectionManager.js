// import * as Visualive from '@visualive/engine';

import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Change from './undoredo/Change.js';

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
    this.do();
  }

  undo() {
    this.do()
  }

  redo() {
    this.do()
  }

  do() {
    for (let treeItem of this.selection){
        treeItem.getParameter('Visible').setValue(this.state);
    }
  }
}


class SelectionManager {
  constructor(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
    this.__selection = new Set();
    this.leadSelection = undefined;
    this.selectionChanged = new Visualive.Signal();
    this.leadSelectionChanged = new Visualive.Signal();
  }

  getSelection(){
    return this.__selection
  }

  setSelection(selection) {
    for (let treeItem of selection){
      if(!this.__selection.has(treeItem)) {
        treeItem.getParameter('Selected').setValue(true);
        this.__selection.add(treeItem);
      }
    }
    for (let treeItem of this.__selection){
      if(!selection.has(treeItem)) {
        treeItem.getParameter('Selected').setValue(false);
        this.__selection.delete(treeItem);
      }
    }
  }

  setLeadSelection(treeItem) {
    this.leadSelection = treeItem;
    this.leadSelectionChanged.emit(treeItem);
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
        // Avoid clearning here, so the deselection can occur.
        clear = count != this.__selection.size;
      }

      if(clear)
        this.clearSelection(false);
    }

    let sel;
    if(!this.__selection.has(treeItem)) {
      treeItem.getParameter('Selected').setValue(true);
      this.__selection.add(treeItem);
      sel = true;
    }
    else {
      treeItem.getParameter('Selected').setValue(false);
      this.__selection.delete(treeItem);
      sel = false;
    }

    if (sel && this.__selection.size === 1) {
      this.setLeadSelection(treeItem);
    }

    treeItem.traverse((subTreeItem)=>{
      if (sel) {
        if(!this.__selection.has(subTreeItem)) {
          subTreeItem.getParameter('Selected').setValue(true);
          this.__selection.add(subTreeItem);
        }
      }
      else {
        if(this.__selection.has(subTreeItem)) {
          subTreeItem.getParameter('Selected').setValue(false);
          this.__selection.delete(subTreeItem);
        }
      }
    })


    if (!sel) {
      if(this.__selection.size === 1)
        this.setLeadSelection(this.__selection.values().next().value);
      else if(this.__selection.size === 0)
        this.setLeadSelection();
    }

    const change = new SelectionChange(this, prevSelection, new Set(this.__selection));
    this.undoRedoManager.addChange(change);

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
      this.setLeadSelection(this.__selection.values().next().value);
    }
    else if (this.__selection.size === 0) {
      this.setLeadSelection();
    }
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
      this.leadSelectionChanged.emit(treeItem);
    }
    else if (this.__selection.size === 0) {
      this.leadSelectionChanged.emit();
    }
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
