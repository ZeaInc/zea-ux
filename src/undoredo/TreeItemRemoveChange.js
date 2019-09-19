import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemRemoveChange extends Change {
  /**
   * Create a TreeItemRemoveChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newValue - The newValue value.
   */
  constructor(treeItem, owner, selectionManager) {
    if (treeItem) {
      super(treeItem.getName() + ' Added');
      this.treeItem = treeItem;
      this.treeItemPath = this.treeItem.getPath();
      this.owner = owner;
      this.selectionManager = selectionManager;
      // The selection may change if the removed item is selected.
      this.prevSelection = new Set(this.selectionManager.getSelection());
      if (this.selectionManager && this.treeItem.isSelected())
        this.selectionManager.deselectItems([this.treeItem]);
      this.treeItemIndex = this.owner.getChildIndex(this.treeItem);
      this.owner.removeChild(this.treeItemIndex);
    } else {
      super();
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.owner.insertChild(this.treeItem, this.treeItemIndex, false, false);
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection);
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.selectionManager && this.treeItem.isSelected())
      this.selectionManager.deselectItems([this.treeItem]);
    this.owner.removeChild(this.treeItemIndex);
  }

  /**
   * The toJSON method.
   * @treeItem {any} appData - The appData treeItem.
   * @return {any} The return value.
   */
  toJSON(appData) {
    const j = {
      name: this.name,
      treeItem: this.treeItem.toJSON(),
      treeItemPath: this.treeItemPath,
      treeItemIndex: this.treeItemIndex,
    };
    return j;
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} appData - The appData treeItem.
   */
  fromJSON(j, appData) {

    const treeItem = appData.scene.getRoot().resolvePath(j.treeItemPath, 1);
    if (!treeItem) {
      console.warn('resolvePath is unable to resolve', j.treeItemPath);
      return;
    }
    this.name = j.name;
    this.treeItem = treeItem;
    this.treeItemIndex = this.owner.getChildIndex(this.treeItem);
    this.owner.removeChild(this.treeItemIndex);
  }
}

UndoRedoManager.registerChange('TreeItemRemoveChange', TreeItemRemoveChange);

export default TreeItemRemoveChange;
