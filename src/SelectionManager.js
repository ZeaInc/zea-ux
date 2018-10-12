
import Change from './undoredo/Change.js';

class SelectionChange extends Change {
  constructor(selectionManager, prevSelection, newSelection) {
    super('SelectionChange');
    this.__selectionManager = selectionManager;
    this.__prevSelection = prevSelection;
    this.__newSelection = newSelection;
  }

  undo() {
    this.__selectionManager.setSelection(this.__oldValue);
  }

  redo() {
    this.__selectionManager.setSelection(this.__newValue);
  }
}

class SelectionManager {
  constructor(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
    this.__selection = new Set();
    this.selectionChanged = new Visualive.Signal();
    this.leadSelectionChanged = new Visualive.Signal();
  }

  toggleItemSelection(treeItem, replaceSelection = true) {
    const prevSelection = new Set(this.__selection);
    const selectedParam = treeItem.getParameter('Selected');

    // Avoid clearing the selection when we have the 
    // item already selected and are deselecting it. 
    // (to clear all selection)
    if (replaceSelection && 
      !(this.__selection.size == 1 && this.__selection.has(selectedParam))) {
        this.clearSelection(false);
      }
    
    if (selectedParam.getValue()) {
      selectedParam.setValue(false);
      this.__selection.delete(selectedParam);
    }
    else {
      selectedParam.setValue(true);
      this.__selection.add(selectedParam);
    }

    const change = new SelectionChange(this, prevSelection, this.__selection);
    this.undoRedoManager.addChange(change);

    if (this.__selection.size === 1) {
      this.leadSelectionChanged.emit(treeItem);
    }
    else if (this.__selection.size === 0) {
      this.leadSelectionChanged.emit();
    }
    this.selectionChanged.emit(this.__selection);
  }

  deselectItem(treeItem) {

    const selectedParam = treeItem.getParameter('Selected');
    if (selectedParam.getValue()) {
      const prevSelection = new Set(this.__selection);
      selectedParam.setValue(false);
      this.__selection.delete(selectedParam);

      const change = new SelectionChange(this, prevSelection, this.__selection);
      this.undoRedoManager.addChange(change);

      this.selectionChanged.emit(this.__selection);
    }
  }

  clearSelection(newChange = true) {
    if (this.__selection.size == 0)
        return false;
    let prevSelection;
    if(newChange) {
       prevSelection = new Set(this.__selection);
    }
    for (let selectedParam of this.__selection){
        selectedParam.setValue(false);
    }
    this.__selection.clear();
    if (newChange){
      const change = new SelectionChange(this, prevSelection, this.__selection);
      this.undoRedoManager.addChange(change);
      this.selectionChanged.emit(this.__selection);
    }
    return true;
  }

  setSelection(selection) {
    for (let selectedParam of selection){
      if(!this.__selection.has(selectedParam)) {
        selectedParam.setValue(true);
        this.__selection.add(selectedParam);
      }
    }
    for (let selectedParam of this.__selection){
      if(!selection.has(selectedParam)) {
        selectedParam.setValue(false);
        this.__selection.delete(selectedParam);
      }
    }
  }
}

export default SelectionManager;
