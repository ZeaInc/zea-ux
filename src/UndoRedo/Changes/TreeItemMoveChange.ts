import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'
import { TreeItem } from '@zeainc/zea-engine'

/**
 * Class representing a `Move TreeItem` Change(Moving a TreeItem from one parent to another).
 *
 * @extends Change
 */
class TreeItemMoveChange extends Change {
  treeItem: TreeItem
  oldOwner: TreeItem
  oldOwnerIndex: number
  newOwner: TreeItem
  /**
   * Creates an instance of TreeItemMoveChange.
   *
   * @param {TreeItem} treeItem - The item to move.
   * @param {TreeItem} newOwner - The new owner item.
   * @memberof TreeItemMoveChange
   */
  constructor(treeItem: TreeItem, newOwner: TreeItem) {
    if (treeItem) {
      super(treeItem.getName() + ' Moved')
      this.treeItem = treeItem
      this.oldOwner = <TreeItem>this.treeItem.getOwner()
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
  undo(): void {
    this.oldOwner.insertChild(this.treeItem, this.oldOwnerIndex, true)
  }

  /**
   * Executes the move action inserting the TreeItem back to the new owner item.
   */
  redo(): void {
    this.newOwner.addChild(this.treeItem, true)
  }

  /**
   * Returns a JSON object with the specifications of the change(Typically used for replication).
   *
   * @param {object} context - The context value
   * @return {object} - JSON object of the change
   */
  toJSON(context: Record<string, any>): Record<string, any> {
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
  fromJSON(j: Record<string, any>, context: Record<string, any>): void {
    if (!context || !context.scene) return

    const treeItem = context.scene.getRoot().resolvePath(j.treeItemPath, 1)
    if (!treeItem) {
      console.warn('resolvePath is unable to resolve', j.treeItemPath)
      return
    }
    const newOwner = context.scene.getRoot().resolvePath(j.newOwnerPath, 1)
    if (!newOwner) {
      console.warn('resolvePath is unable to resolve', j.newOwnerPath)
      return
    }
    this.name = j.name
    this.treeItem = treeItem
    this.newOwner = newOwner

    this.oldOwner = <TreeItem>this.treeItem.getOwner()
    this.oldOwnerIndex = this.oldOwner.getChildIndex(this.treeItem)
    this.newOwner.addChild(this.treeItem, true)
  }
}

UndoRedoManager.registerChange('TreeItemMoveChange', TreeItemMoveChange)

export { TreeItemMoveChange }
