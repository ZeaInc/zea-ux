
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

    // Avoid clearing the selection when we have the 
    // item already selected and are deselecting it. 
    // (to clear all selection)
    if (replaceSelection && 
      (this.__selection.size != 1 && !this.__selection.has(treeItem))) {
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
      this.leadSelectionChanged.emit(treeItem);
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
        this.leadSelectionChanged.emit(this.__selection.values().next().value);
      else if(this.__selection.size === 0)
        this.leadSelectionChanged.emit();
    }

    const change = new SelectionChange(this, prevSelection, this.__selection);
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
        this.__selection.add(selectedParam);

        treeItem.traverse((subTreeItem)=>{
          if(this.__selection.has(subTreeItem)) {
            subTreeItem.getParameter('Selected').setValue(false);
            this.__selection.delete(treeItem);
          }
        })
      }
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
            this.__selection.add(treeItem);
          }
        })
      }
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


}

export default SelectionManager;
