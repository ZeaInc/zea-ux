// import * as Visualive from '@visualive/engine';

import UndoRedoManager from './undoredo/UndoRedoManager.js';
import Change from './undoredo/Change.js';
import { 
  AxialRotationSceneWidget,
  LinearMovementSceneWidget,
  PlanarMovementSceneWidget
} from './sceneWidgets';

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

    const size = 0.3
    //////////////////////////////////
    // AxialRotationSceneWidget
    {
      const rotationXWidget = new AxialRotationSceneWidget(
        'rotationX',
        0.5,
        new Visualive.Color('red'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0,1,0), Math.PI * 0.5);
      rotationXWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(rotationXWidget);
      rotationXWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }
    {
      const rotationYWidget = new AxialRotationSceneWidget(
        'rotationY',
        0.5,
        new Visualive.Color('green'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1,0,0), Math.PI * 0.5);
      rotationYWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(rotationYWidget);
      rotationYWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }
    {
      const rotationZWidget = new AxialRotationSceneWidget(
        'rotationZ',
        0.5,
        new Visualive.Color('blue'),
        undoRedoManager
      );
      this.selectionGroup.addChild(rotationZWidget);
      rotationZWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }

    //////////////////////////////////
    // LinearMovementSceneWidget
    {
      const linearXWidget = new LinearMovementSceneWidget(
        'linearX',
        0.5,
        new Visualive.Color('red'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0,1,0), Math.PI * 0.5);
      linearXWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(linearXWidget);
      linearXWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }
    {
      const linearYWidget = new LinearMovementSceneWidget(
        'linearY',
        0.5,
        new Visualive.Color('green'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1,0,0), Math.PI * 0.5);
      linearYWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(linearYWidget);
      linearYWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }
    {
      const linearZWidget = new LinearMovementSceneWidget(
        'linearZ',
        0.5,
        new Visualive.Color('blue'),
        undoRedoManager
      );
      this.selectionGroup.addChild(linearZWidget);
      linearZWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }

    //////////////////////////////////
    // planarXYWidget
    {
      const planarXYWidget = new PlanarMovementSceneWidget(
        'planarXY',
        size,
        new Visualive.Color('green'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(size*0.5, size*0.5, 0.0)
      planarXYWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(planarXYWidget);
      planarXYWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }
    {
      const planarYZWidget = new PlanarMovementSceneWidget(
        'planarYZ',
        size,
        new Visualive.Color('red'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(0.0, size*0.5, size*0.5)
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0,1,0), Math.PI * 0.5);
      planarYZWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(planarYZWidget);
      planarYZWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
     
    }
    {
      const planarXZWidget = new PlanarMovementSceneWidget(
        'planarXZ',
        size,
        new Visualive.Color('blue'),
        undoRedoManager
      );
      const xfo = new Visualive.Xfo();
      xfo.tr.set(size*0.5, 0.0, size*0.5)
      xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(1,0,0), Math.PI * 0.5);
      planarXZWidget.getParameter('LocalXfo').setValue(xfo)
      this.selectionGroup.addChild(planarXZWidget);
      planarXZWidget.setTargetParam(this.selectionGroup.getParameter('GlobalXfo'), false);
    }

  }
  setRenderer(renderer) {
    this.__renderer = renderer;
    this.__renderer.addTreeItem(this.selectionGroup);
  }

  updateGizmos(){
    const selection = this.selectionGroup.getParameter('Items').getValue();
    const visible = Array.from(selection).length > 0;
    if(Array.from(selection).length > 0)
      this.selectionGroup.recalcInitialXfo();
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