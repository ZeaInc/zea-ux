// import * as Visualive from '@visualive/engine';

import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Change from './undoredo/Change.js';
import XfoHandle from './sceneWidgets/XfoHandle.js';
import {SelectionTool} from './tools/SelectionTool.js';

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
  constructor(appData) {
    this.appData = appData;
    this.leadSelection = undefined;
    this.selectionChanged = new Visualive.Signal();
    this.leadSelectionChanged = new Visualive.Signal();

    this.selectionGroup = new Visualive.Group('selection');
    this.selectionGroup.getParameter('InitialXfoMode').setValue(Visualive.Group.INITIAL_XFO_MODES.average);
    this.selectionGroup.propagateSelectionToItems = true;
    this.selectionGroup.propagateSelectionChangesFromItems = false;
    this.selectionGroup.setSelected(true);

    const size = 0.1
    const thickness = size * 0.02
    this.xfoHandle = new XfoHandle(size, thickness);
    this.xfoHandle.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    this.xfoHandle.setVisible(false)
    // this.xfoHandle.showHandles('Translate')
    // this.xfoHandle.showHandles('Rotate')
    // this.xfoHandle.showHandles('Scale')
    this.selectionGroup.addChild(this.xfoHandle);

    ///////////////////////////////////
    // UI and Hotkeys
    /*
    let selectItemsActivatedTime;
    let selectItemsActivated = false;
    const selectionTool = new SelectionTool(appData);
    appData.actionRegistry.registerAction({
      path: ['Edit'],
      name: 'Select Items',
      callback: () => {
        // if (renderer.isXRViewportPresenting())
        //   return;

        if (selectItemsActivated) {
          appData.toolManager.popTool();
          selectItemsActivated = false;
        } else {
          appData.toolManager.pushTool(selectionTool);
          selectItemsActivated = true;
          selectItemsActivatedTime = performance.now();
        }
      },
      hotkeyReleaseCallback: () => {
        // if (renderer.isXRViewportPresenting())
        //   return;

        if (selectItemsActivated) {
          const t = performance.now() - selectItemsActivatedTime;
          if (t > 400) {
            appData.toolManager.popTool();
            selectItemsActivated = false;
          }
        }
      },
      key: 'q',
      availableInVR: true,
    });
    */

    const handleGroup = {
      Translate: new Visualive.Signal(),
      Rotate: new Visualive.Signal(),
      Scale: new Visualive.Signal(),
    };
    let currMode = '';
    const showHandles = mode => {
      if (currMode != mode) {
        currMode = mode;
        for (let key in handleGroup) {
          handleGroup[key].emit(mode == key);
        }
        this.xfoHandle.showHandles(mode)
      }
    };
    appData.actionRegistry.registerAction({
      name: 'Translate',
      path: ['Edit'],
      callback: () => {
        showHandles('Translate')
      },
      key: 'w',
      activatedChanged: handleGroup.Translate
    });
    appData.actionRegistry.registerAction({
      name: 'Rotate',
      path: ['Edit'],
      callback: () => {
        showHandles('Rotate')
      },
      key: 'e',
      activatedChanged: handleGroup.Rotate
    });
    appData.actionRegistry.registerAction({
      name: 'Scale',
      path: ['Edit'],
      callback: () => {
        showHandles('Scale')
      },
      key: 'r',
      activatedChanged: handleGroup.Scale
    });

    // Translate Activated by default.
    // showHandles('Translate')
  }

  setRenderer(renderer) {
    this.__renderer = renderer;
    this.__renderer.addTreeItem(this.selectionGroup);
  }

  updateGizmos(){
    const selection = this.selectionGroup.getItems();
    const visible = Array.from(selection).length > 0;
    if(Array.from(selection).length > 0)
      this.selectionGroup.recalcInitialXfo();

    this.xfoHandle.setVisible(visible)
    this.__renderer.requestRedraw();
  }

  getSelection(){
    return this.selectionGroup.getItems();
  }

  setSelection(newSelection) {
    const selection = new Set(this.selectionGroup.getItems());
    const prevSelection = new Set(selection);
    for (let treeItem of newSelection){
      if(!selection.has(treeItem)) {
        // treeItem.setSelected(true);
        selection.add(treeItem);
      }
    }
    for (let treeItem of selection){
      if(!newSelection.has(treeItem)) {
        treeItem.setSelected(false);
        selection.delete(treeItem);
      }
    }

    this.selectionGroup.setItems(selection);
    this.updateGizmos();

    // Deselecting can change the lead selected item.
    if(selection.size > 0)
      this.__setLeadSelection(selection.values().next().value);
    else
      this.__setLeadSelection();

    const change = new SelectionChange(this, selection, prevSelection);
    this.appData.undoRedoManager.addChange(change);
  }

  __setLeadSelection(treeItem) {
    if(this.leadSelection != treeItem) {
      this.leadSelection = treeItem;
      this.leadSelectionChanged.emit(treeItem);
    }
  }

  toggleItemSelection(treeItem, replaceSelection = true) {

    const selection = new Set(this.selectionGroup.getItems());
    const prevSelection = new Set(selection);

    // Avoid clearing the selection when we have the
    // item already selected and are deselecting it.
    // (to clear all selection)
    if (replaceSelection && !(selection.size == 1 && selection.has(treeItem))) {

      let clear = true;
      if(selection.has(treeItem)) {
        let count = 1;
        treeItem.traverse((subTreeItem)=>{
          if(selection.has(subTreeItem)) {
            count++;
          }
        })
        // Note: In some cases, the item is currently selected, and
        // its children make up all the selected items. In that case
        // the user intends to deselect the item and all its children.
        // Avoid cleaning here, so the deselection can occur.
        clear = count != selection.size;
      }

      if(clear) {
        Array.from(selection).forEach(item => {
          item.setSelected(false);
        })
        selection.clear();
      }
    }

    let sel;
    if(!selection.has(treeItem)) {
      // treeItem.setSelected(true);
      selection.add(treeItem);
      sel = true;
    }
    else {
      treeItem.setSelected(false);
      selection.delete(treeItem);
      sel = false;
    }

    const preExpandSelSize = selection.size

    // Now expand the selection to the subtree.
    // treeItem.traverse((subTreeItem)=>{
    //   if (sel) {
    //     if(!selection.has(subTreeItem)) {
    //       // subTreeItem.setSelected(true);
    //       selection.add(subTreeItem);
    //       // this.selectionGroup.addItem(treeItem);
    //     }
    //   }
    //   else {
    //     if(selection.has(subTreeItem)) {
    //       subTreeItem.setSelected(false);
    //       selection.delete(subTreeItem);
    //       // this.selectionGroup.removeItem(treeItem);
    //     }
    //   }
    // })

    this.selectionGroup.setItems(selection);

    if (sel && preExpandSelSize === 1) {
      this.__setLeadSelection(treeItem);
    }
    else if (!sel) {
      // Deselecting can change the lead selected item.
      if(selection.size === 1)
        this.__setLeadSelection(selection.values().next().value);
      else if(selection.size === 0)
        this.__setLeadSelection();
    }

    const change = new SelectionChange(this, selection, prevSelection);
    this.appData.undoRedoManager.addChange(change);

    this.updateGizmos();
    this.selectionChanged.emit(prevSelection);
  }

  clearSelection(newChange = true) {
    const selection = this.selectionGroup.getItems();
    if (selection.size == 0)
        return false;
    let prevSelection;
    if(newChange) {
       prevSelection = new Set(selection);
    }
    for (let treeItem of selection){
      treeItem.setSelected(false);
    }
    selection.clear();
    this.selectionGroup.setItems(selection);
    if (newChange){
      const change = new SelectionChange(this, prevSelection, selection);
      this.appData.undoRedoManager.addChange(change);
      this.selectionChanged.emit(selection);
    }
    return true;
  }


  selectItems(treeItems, replaceSelection=true) {
    const selection = this.selectionGroup.getItems();
    const prevSelection = new Set(selection);

    if (replaceSelection) {
      prevSelection.clear();
    }

    for(let treeItem of treeItems) {
      if (!treeItem.getSelected()) {
        // treeItem.getSelected(true);
        selection.add(treeItem);

        // treeItem.traverse((subTreeItem)=>{
        //   if(!selection.has(subTreeItem)) {
        //     // subTreeItem.setSelected(true);
        //     selection.add(subTreeItem);
        //   }
        // })
      }
    }

    const change = new SelectionChange(this, selection, prevSelection);
    this.appData.undoRedoManager.addChange(change);

    this.selectionGroup.setItems(selection);
    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value);
    }
    else if (selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateGizmos();
    this.selectionChanged.emit(selection);
  }

  deselectItems(treeItems) {
    const selection = this.selectionGroup.getItems();
    const prevSelection = new Set(selection);

    for(let treeItem of treeItems) {
      if (treeItem.getSelected()) {
        treeItem.setSelected(false);
        selection.delete(selectedParam);
        // treeItem.traverse((subTreeItem)=>{
        //   if(!selection.has(subTreeItem)) {
        //     subTreeItem.setSelected(false);
        //     selection.delete(treeItem);
        //   }
        // })
      }
    }

    this.selectionGroup.setItems(selection);
    const change = new SelectionChange(this, prevSelection, selection);
    this.appData.undoRedoManager.addChange(change);

    if (selection.size === 1) {
      this.__setLeadSelection(selection.values().next().value);
    }
    else if (selection.size === 0) {
      this.__setLeadSelection();
    }
    this.updateGizmos();
    this.selectionChanged.emit(selection);
  }

  toggleSelectionVisiblity(){
    if(this.leadSelection) {
      const selection = this.selectionGroup.getItems();
      const state = !this.leadSelection.getVisible();
      const change = new ToggleSelectionVisibility(selection, state);
      this.appData.undoRedoManager.addChange(change);
    }
  }

  //////////////////////////////////////
  // 
  startPickingMode(label, fn, filterFn, count) {
    // Display this in a status bar.
    console.log(label);
    this.__pickCB = fn;
    this.__pickFilter = filterFn;
    this.__pickCount = count;
    this.__picked = [];
  }

  pickingFilter(item) {
    return this.__pickFilter(item);
  }

  pickingModeActive() {
    return this.__pickCB != undefined;
  }

  cancelPickingMode() {
    this.__pickCB = undefined;
  }

  pick(item) {
    if(this.__pickCB) {
      if(Array.isArray(item)) {
        if(this.__pickFilter)
          this.__picked = this.__picked.concat(item.filter(this.__pickFilter));
        else
          this.__picked = this.__picked.concat(item);
      }
      else {
        if(this.__pickFilter && !this.__pickFilter(item))
          return;
        this.__picked.push(item);
      }
      if(this.__picked.length == this.__pickCount) {
        this.__pickCB(this.__picked)
        this.__pickCB = undefined;
      }
    }
  }

}

export default SelectionManager;

export {
  SelectionManager
}