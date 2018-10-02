class SelectionManager {
  constructor(rootTreeItem) {
    this.selectionList = [];
    this.addTreeItem(rootTreeItem);
    this.leadSelectionChange = new Visualive.Signal();
  }

  addTreeItem(treeItem) {
    treeItem.selectedChanged.connect(() => {
      const selected = treeItem.getSelected();
      if (selected) {
        this.selectionList.push(treeItem);
        if (this.selectionList.length === 1) {
          this.leadSelectionChange.emit(treeItem);
        }
      } else {
        const itemToRemoveIndex = this.selectionList.indexOf(treeItem);
        if (itemToRemoveIndex >= 0) {
          this.selectionList.splice(itemToRemoveIndex, 1);
          if (this.selectionList.length === 1) {
            this.leadSelectionChange.emit(treeItem);
          } else if (!this.selectionList.length) {
            this.leadSelectionChange.emit(null);
          }
        }
      }
    });

    // Traverse the tree adding items till we hit the leaves(which are usually GeomItems.)
    for (let childItem of treeItem.getChildren()) {
      this.addTreeItem(childItem);
    }

    treeItem.childAdded.connect(childItem => this.addTreeItem(childItem));
  }
}

export default SelectionManager;
