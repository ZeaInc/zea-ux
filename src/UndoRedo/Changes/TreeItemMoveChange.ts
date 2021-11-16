import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'

/**
 * Class representing a `Move TreeItem` Change(Moving a TreeItem from one parent to another).
 *
 * @extends Change
 */
class TreeItemMoveChange extends Change {
  /**
   * Creates an instance of TreeItemMoveChange.
   *
   * @param {TreeItem} treeItem - The item to move.
   * @param {TreeItem} newOwner - The new owner item.
   * @memberof TreeItemMoveChange
   */
  constructor(treeItem, newOwner) {
    if (treeItem) {
      super(treeItem.getName() + ' Moved')
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
   * Inserts back the moved TreeItem in the old owner item(Rollbacks the move action).
   */
  undo() {
    this.oldOwner.insertChild(this.treeItem, this.oldOwnerIndex, true)
  }

  /**
   * Executes the move action inserting the TreeItem back to the new owner item.
   */
  redo() {
    this.newOwner.addChild(this.treeItem, true)
  }

  /**
   * Returns a JSON object with the specifications of the change(Typically used for replication).
   *
   * @param {object} context - The context value
   * @return {object} - JSON object of the change
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
   * Restores the Change state from the specified JSON object.
   *
   * @param {object} j - The serialized object with the change data.
   * @param {object} context - The context value
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
