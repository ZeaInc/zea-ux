import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemAddChange extends Change {
  /**
   * Create a TreeItemAddChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newValue - The newValue value.
   */
  constructor(treeItem, owner, selectionManager) {
    if (treeItem) {
      super(treeItem.getName() + ' Added');
      this.treeItem = treeItem;
      this.owner = owner;
      this.selectionManager = selectionManager;
      this.prevSelection = new Set(this.selectionManager.getSelection());
      this.treeItemIndex = this.owner.addChild(this.treeItem);
      this.selectionManager.setSelection(new Set([this.treeItem]));

      this.treeItem.addRef(this);
    } else {
      super();
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.owner.removeChild(this.treeItemIndex);
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection);
  }

  /**
   * The redo method.
   */
  redo() {
    this.owner.addChild(this.treeItem);
    if (this.selectionManager)
      this.selectionManager.setSelection(new Set([this.treeItem]));
  }

  /**
   * The toJSON method.
   * @treeItem {any} context - The context treeItem.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      treeItem: this.treeItem.toJSON(context),
      treeItemPath: this.treeItem.getPath(),
      treeItemIndex: this.treeItemIndex,
    };
    return j;
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} context - The context treeItem.
   */
  fromJSON(j, context) {

    const treeItem = ZeaEngine.sgFactory.constructClass(j.treeItem.type);
    if (!treeItem) {
      console.warn('resolvePath is unable to conostruct', j.treeItem);
      return;
    }
    this.name = j.name;
    this.treeItem = treeItem;
    this.treeItem.addRef(this);
    
    this.treeItem.fromJSON(j.treeItem, context);
    this.treeItemIndex = this.owner.addChild(this.treeItem, false, false);
  }

  destroy() { 
    this.treeItem.removeRef(this);
  }
}

UndoRedoManager.registerChange('TreeItemAddChange', TreeItemAddChange);

export {
  TreeItemAddChange
};
