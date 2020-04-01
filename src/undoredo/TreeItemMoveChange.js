import UndoRedoManager from './UndoRedoManager.js'
import Change from './Change.js'

/**
 * Class representing a treeItemeter value change.
 * @extends Change
 */
class TreeItemMoveChange extends Change {
  /**
   * Create a TreeItemMoveChange.
   * @treeItem {any} treeItem - The treeItem value.
   * @treeItem {any} newOwner - The newOwner value.
   */
  constructor(treeItem, newOwner) {
    if (treeItem) {
      console.log('TreeItemMoveChange')
      super(treeItem.getName() + ' Added')
      this.treeItem = treeItem
      this.oldOwner = this.treeItem.getOwner()
      this.oldOwnerIndex = this.oldOwner.getChildIndex(this.treeItem)
      this.newOwner = newOwner
      this.newOwner.addChild(this.treeItem, true)
    } else {
      super()
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.oldOwner.insertChild(this.treeItem, this.oldOwnerIndex, true)
  }

  /**
   * The redo method.
   */
  redo() {
    this.newOwner.addChild(this.treeItem, true)
  }

  /**
   * The toJSON method.
   * @treeItem {any} context - The context treeItem.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = {
      name: this.name,
      treeItemPath: this.treeItem.getPath(),
      newOwnerPath: this.newOwner.getPath(),
    }
    return j
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} context - The context treeItem.
   */
  fromJSON(j, context) {
    const treeItem = appData.scene.getRoot().resolvePath(j.treeItemPath, 1)
    if (!treeItem) {
      console.warn('resolvePath is unable to resolve', j.treeItemPath)
      return
    }
    const newOwner = appData.scene.getRoot().resolvePath(j.newOwnerPath, 1)
    if (!newOwner) {
      console.warn('resolvePath is unable to resolve', j.newOwnerPath)
      return
    }
    this.name = j.name
    this.treeItem = treeItem
    this.newOwner = newOwner

    this.oldOwner = this.treeItem.getOwner()
    this.oldOwnerIndex = this.oldOwner.getChildIndex(this.treeItem)
    this.newOwner.addChild(this.treeItem, true)
  }
}

UndoRedoManager.registerChange('TreeItemMoveChange', TreeItemMoveChange)

export { TreeItemMoveChange }
