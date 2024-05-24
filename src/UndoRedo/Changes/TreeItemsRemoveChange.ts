import { TreeItem, Operator } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'
import SelectionManager from '../../SelectionManager.js'
import { AppData } from '../../../types/types.js'

/**
 * Class representing a TreeItems removal Change,
 * taking into account that it would remove all the specified items ti their children
 *
 * @extends Change
 */
class TreeItemsRemoveChange extends Change {
  private items: Array<TreeItem> = []
  private itemOwners: Array<TreeItem> = []
  private itemPaths: Array<Array<string>> = []
  private itemIndices: Array<number> = []

  /**
   * Creates an instance of TreeItemsRemoveChange.
   *
   * @param items - List of TreeItems
   * @param appData - The appData value
   */
  constructor(items: Array<TreeItem>, appData: AppData) {
    super()

    if (items) {
      this.items = items
      const newSelection = new Set(appData?.selectionManager?.getSelection())

      const itemNames: Array<string> = []
      this.items.forEach((item: TreeItem) => {
        const owner = <TreeItem>item.getOwner()
        const itemIndex = owner.getChildIndex(item)
        itemNames.push(item.getName())
        this.itemOwners.push(owner)
        this.itemPaths.push(item.getPath())
        this.itemIndices.push(itemIndex)

        if (newSelection.has(item)) newSelection.delete(item)
        item.traverse((subTreeItem: TreeItem) => {
          if (newSelection.has(subTreeItem)) newSelection.delete(subTreeItem)
        }, false)

        owner.removeChild(itemIndex)
      })
      if (appData?.selectionManager) {
        appData.selectionManager.setSelection(newSelection, true, this)
      }

      this.name = itemNames + ' Deleted'
    }
  }

  /**
   * Restores all items removed in the change, reattaching them to their old owners.
   */
  undo(): void {
    this.items.forEach((item, index) => {
      this.itemOwners[index].insertChild(item, this.itemIndices[index], false, false)
    })
  }

  /**
   * Executes initial change to remove items from their owners.
   */
  redo(): void {
    this.items.forEach((item, index) => {
      this.itemOwners[index].removeChild(this.itemIndices[index])
    })
  }

  /**
   * Serializes current change data as a JSON object, so this action can be stored/replicated somewhere else.
   *
   * @param appData - The appData value
   * @return {object} - JSON Object representation of current change
   * @memberof TreeItemsRemoveChange
   */
  toJSON(context?: Record<any, any>): Record<string, any> {
    const j = super.toJSON(context)
    j.itemPaths = this.itemPaths
    j.itemIndices = this.itemIndices
    return j
  }

  /**
   * Restores Change action from a JSON object.
   *
   * @param j - The JSON object with Change data.
   * @param appData - The appData value
   * @memberof TreeItemsRemoveChange
   */
  fromJSON(j: Record<string, any>, context: Record<any, any>): void {
    super.fromJSON(j, context)

    const sceneRoot = context.appData.scene.getRoot()
    j.itemPaths.forEach((itemPath: string[]) => {
      const item = sceneRoot.resolvePath(itemPath, 1)
      if (!item) {
        console.warn('resolvePath is unable to resolve', itemPath)
        return
      }
      const owner = <TreeItem>item.getOwner()
      const itemIndex = owner.getChildIndex(item)
      this.itemOwners.push(owner)
      this.itemPaths.push(item.getPath())
      this.itemIndices.push(itemIndex)

      owner.removeChild(itemIndex)
    })
  }
}

UndoRedoManager.registerChange('TreeItemsRemoveChange', TreeItemsRemoveChange)

export { TreeItemsRemoveChange }
