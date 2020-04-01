import { TreeItem, Operator } from '@zeainc/zea-engine'
import UndoRedoManager from './UndoRedoManager.js'
import Change from './Change.js'

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
  constructor(items, appData) {
    super()
    this.items = []
    this.itemOwners = []
    this.itemPaths = []
    this.itemIndices = []
    if (items) {
      this.selectionManager = appData.selectionManager
      this.prevSelection = new Set(this.selectionManager.getSelection())
      this.items = items
      this.newSelection = new Set(this.prevSelection)

      const itemNames = []
      this.items.forEach((item) => {
        const owner = item.getOwner()
        const itemIndex = owner.getChildIndex(item)
        itemNames.push(item.getName())
        item.addRef(this)
        this.itemOwners.push(owner)
        this.itemPaths.push(item.getPath())
        this.itemIndices.push(itemIndex)

        if (this.selectionManager && this.newSelection.has(item))
          this.newSelection.delete(item)
        if (item instanceof Operator) {
          const op = item
          op.detach()
        } else if (item instanceof TreeItem) {
          item.traverse((subTreeItem) => {
            if (subTreeItem instanceof Operator) {
              const op = subTreeItem
              op.detach()
            }
            if (this.selectionManager && this.newSelection.has(subTreeItem))
              this.newSelection.delete(subTreeItem)
          }, false)
        }

        owner.removeChild(itemIndex)
      })
      this.selectionManager.setSelection(this.newSelection, false)

      this.name = itemNames + ' Deleted'
    }
  }

  /**
   * The undo method.
   */
  undo() {
    this.items.forEach((item, index) => {
      this.itemOwners[index].insertChild(
        item,
        this.itemIndices[index],
        false,
        false
      )

      // Now re-attach all the detached operators.
      if (item instanceof Operator) {
        const op = item
        op.reattach()
      } else if (subTreeItem instanceof TreeItem) {
        item.traverse((subTreeItem) => {
          if (subTreeItem instanceof Operator) {
            const op = subTreeItem
            op.reattach()
          }
        }, false)
      }
    })
    if (this.selectionManager)
      this.selectionManager.setSelection(this.prevSelection, false)
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.selectionManager)
      this.selectionManager.setSelection(this.newSelection, false)

    // Now re-detach all the operators.
    this.items.forEach((item, index) => {
      this.itemOwners[index].removeChild(this.itemIndices[index])

      if (item instanceof Operator) {
        const op = item
        op.detach()
      } else if (subTreeItem instanceof TreeItem) {
        item.traverse((subTreeItem) => {
          if (subTreeItem instanceof Operator) {
            const op = subTreeItem
            op.detach()
          }
        }, false)
      }
    })
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
      itemIndices: this.itemIndices,
    }
    this.items.forEach((item) => {
      j.items.push(item.toJSON())
    })
    return j
  }

  /**
   * The fromJSON method.
   * @treeItem {any} j - The j treeItem.
   * @treeItem {any} appData - The appData treeItem.
   */
  fromJSON(j, appData) {
    this.name = j.name
    j.itemPaths.forEach((itemPath) => {
      const item = appData.scene.getRoot().resolvePath(itemPath, 1)
      if (!item) {
        console.warn('resolvePath is unable to resolve', itemPath)
        return
      }
      const owner = item.getOwner()
      this.itemOwners.push(owner)
      this.itemPaths.push(item.getPath())
      this.itemIndices.push(owner.getChildIndex(item))
    })
  }

  /**
   * The destroy method cleans up any data requiring manual cleanup.
   * Deleted items still on the undo stack are then flushed and any
   * GPU resoruces cleaned up.
   */
  destroy() {
    this.items.forEach((item) => item.removeRef(this))
  }
}

UndoRedoManager.registerChange('TreeItemsRemoveChange', TreeItemsRemoveChange)

export { TreeItemsRemoveChange }
