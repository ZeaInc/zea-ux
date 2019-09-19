import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemsRemoveChange extends Change {
  /**
   * Create a TreeItemsRemoveChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newValue - The newValue value.
   */
  constructor(items, selectionManager) {
    super();
    this.items = [];
    this.itemOwners = [];
    this.itemPaths = [];
    this.itemIndices = [];
    if (items) {
      this.selectionManager = selectionManager;
      this.prevSelection = new Set(this.selectionManager.getSelection());
      this.items = items;
      this.newSelection = new Set(this.prevSelection);
      
      const itemNames = [];
      this.items.forEach(item => {
        itemNames.push(item.getName());
        item.addRef(this);
        const owner = item.getOwner();
        const itemIndex = owner.getChildIndex(item);
        this.itemOwners.push(owner);
        this.itemPaths.push(item.getPath());
        this.itemIndices.push(itemIndex);
        owner.removeChild(itemIndex);
        if (this.selectionManager && this.newSelection.has(item))
          this.newSelection.delete(item);
      });
      this.selectionManager.setSelection(this.newSelection);
      
      this.name = (itemNames + " Deleted");
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.items.forEach((item, index) => {
      this.itemOwners[index].insertChild(item, this.itemIndices[index], false, false);
    });
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection);
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.selectionManager)
      this.selectionManager.setSelection(this.newSelection);
    this.items.forEach((item, index) => {
      this.itemOwners[index].removeChild(this.itemIndices[index]);
    });
  }

  /**
   * The toJSON method.
   * @treeItem {any} appData - The appData treeItem.
   * @return {any} The return value.
   */
  toJSON(appData) {
    const j = {
      name: this.name,
      items: [],
      itemPaths: this.itemPaths,
      itemIndices: this.itemIndices
    };
    this.items.forEach(item => {
      j.items.push(item.toJSON());
    });
    return j;
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} appData - The appData treeItem.
   */
  fromJSON(j, appData) {
    this.name = j.name;
    j.itemPaths.forEach(itemPath => {
      const item = appData.scene.getRoot().resolvePath(itemPath, 1);
      if (!item) {
        console.warn('resolvePath is unable to resolve', itemPath);
        return;
      }
      const owner = item.getOwner();
      this.itemOwners.push(owner);
      this.itemPaths.push(item.getPath());
      this.itemIndices.push(owner.getChildIndex(item));
    });
  }
}

UndoRedoManager.registerChange('TreeItemsRemoveChange', TreeItemsRemoveChange);

export {
  TreeItemsRemoveChange
};
