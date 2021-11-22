import { TreeItem, Operator } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'
import SelectionManager from '../../SelectionManager.js'
import { AppData } from '../../../types/temp.js'

/**
 * Class representing a TreeItems removal Change,
 * taking into account that it would remove all the specified items ti their children
 *
 * @extends Change
 */
class TreeItemsRemoveChange extends Change {
  items = []
  itemOwners = []
  itemPaths = []
  itemIndices = []

  selectionManager: SelectionManager
  prevSelection: Set<TreeItem>
  newSelection: Set<TreeItem>
  /**
   * Creates an instance of TreeItemsRemoveChange.
   *
   * @param {array} items - List of TreeItems
   * @param {object} appData - The appData value
   */
  constructor(items: Array<TreeItem>, appData: AppData) {
    super()

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

        if (this.selectionManager && this.newSelection.has(item)) this.newSelection.delete(item)
        if (item instanceof Operator) {
          const op = item
          op.detach()
        } else if (item instanceof TreeItem) {
          item.traverse((subTreeItem) => {
            if (subTreeItem instanceof Operator) {
              const op = subTreeItem
              op.detach()
            }
            if (this.selectionManager && this.newSelection.has(subTreeItem)) this.newSelection.delete(subTreeItem)
          }, false)
        }

        owner.removeChild(itemIndex)
      })
      this.selectionManager.setSelection(this.newSelection, false)

      this.name = itemNames + ' Deleted'
    }
  }

  /**
   * Restores all items removed in the change, reattaching them to their old owners.
   */
  undo(): void {
    this.items.forEach((item, index) => {
      this.itemOwners[index].insertChild(item, this.itemIndices[index], false, false)

      // Now re-attach all the detached operators.
      if (item instanceof Operator) {
        const op = item
        op.reattach()
      } else if (item instanceof TreeItem) {
        item.traverse((subTreeItem) => {
          if (subTreeItem instanceof Operator) {
            const op = subTreeItem
            op.reattach()
          }
        }, false)
      }
    })
    if (this.selectionManager) this.selectionManager.setSelection(this.prevSelection, false)
  }

  /**
   * Executes initial change to remove items from their owners.
   */
  redo(): void {
    if (this.selectionManager) this.selectionManager.setSelection(this.newSelection, false)

    // Now re-detach all the operators.
    this.items.forEach((item, index) => {
      this.itemOwners[index].removeChild(this.itemIndices[index])

      if (item instanceof Operator) {
        const op = item
        op.detach()
      } else if (item instanceof TreeItem) {
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
   * Serializes current change data as a JSON object, so this action can be stored/replicated somewhere else.
   *
   * @param {object} appData - The appData value
   * @return {object} - JSON Object representation of current change
   * @memberof TreeItemsRemoveChange
   */
  toJSON(appData: AppData): Record<string, any> {
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
   * Restores Change action from a JSON object.
   *
   * @param {object} j - The JSON object with Change data.
   * @param {object} appData - The appData value
   * @memberof TreeItemsRemoveChange
   */
  fromJSON(j: Record<string, any>, appData: AppData) {
    this.name = j.name
    j.itemPaths.forEach((itemPath) => {
      const item =  <TreeItem>appData.scene.getRoot().resolvePath(itemPath, 1)
      if (!item) {
        console.warn('resolvePath is unable to resolve', itemPath)
        return
      }
      const owner = <TreeItem>item.getOwner()
      this.itemOwners.push(owner)
      this.itemPaths.push(item.getPath())
      this.itemIndices.push(owner.getChildIndex(item))
    })
  }

  /**
   * The destroy method cleans up any data requiring manual cleanup.
   * Deleted items still on the undo stack are then flushed and any
   * GPU resources cleaned up.
   */
  destroy() {
    this.items.forEach((item) => item.removeRef(this))
  }
}

UndoRedoManager.registerChange('TreeItemsRemoveChange', TreeItemsRemoveChange)

export { TreeItemsRemoveChange }
