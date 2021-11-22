import { TreeItem, Operator, Registry } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'
import { SelectionManager } from '../../index.js'

/**
 * Class representing an `Add TreeItem` Change. Meaning that this should be called when you add a new `TreeItem` to the scene.
 *
 * @extends Change
 */
class TreeItemAddChange extends Change {
  treeItem: TreeItem
  owner: TreeItem
  prevSelection: Set<TreeItem>
  selectionManager: SelectionManager
  treeItemIndex: number
  /**
   * Creates an instance of TreeItemAddChange.
   *
   * @param {TreeItem} treeItem -
   * @param {TreeItem} owner -
   * @param {SelectionManager} selectionManager -
   */
  constructor(treeItem: TreeItem, owner: TreeItem, selectionManager: SelectionManager) {
    if (treeItem) {
      super(treeItem.getName() + ' Added')
      this.treeItem = treeItem
      this.owner = owner
      this.selectionManager = selectionManager
      this.prevSelection = new Set(this.selectionManager.getSelection())
      this.treeItemIndex = this.owner.getChildIndex(this.owner.addChild(this.treeItem))
      this.selectionManager.setSelection(new Set([this.treeItem]), false)

    } else {
      super()
    }
  }

  /**
   * Removes the newly added TreeItem from its owner.
   */
  undo(): void {
    if (this.treeItem instanceof Operator) {
      const op = this.treeItem
      op.detach()
    } else if (this.treeItem instanceof TreeItem) {
      this.treeItem.traverse((subTreeItem) => {
        if (subTreeItem instanceof Operator) {
          const op = subTreeItem
          op.detach()
        }
      }, false)
    }
    this.owner.removeChild(this.treeItemIndex)
    if (this.selectionManager) this.selectionManager.setSelection(this.prevSelection, false)
  }

  /**
   * Restores undone `TreeItem`.
   */
  redo(): void {
    // Now re-attach all the detached operators.
    if (this.treeItem instanceof Operator) {
      const op = this.treeItem
      op.reattach()
    } else if (this.treeItem instanceof TreeItem) {
      this.treeItem.traverse((subTreeItem) => {
        if (subTreeItem instanceof Operator) {
          const op = subTreeItem
          op.reattach()
        }
      }, false)
    }
    this.owner.addChild(this.treeItem)
    if (this.selectionManager) this.selectionManager.setSelection(new Set([this.treeItem]), false)
  }

  /**
   * Serializes `TreeItem` like instanced class into a JSON object.
   *
   * @param {object} context - The context treeItem
   * @return {object} - JSON object
   */
  toJSON(context: Record<any, any>) {
    const j = {
      name: this.name,
      treeItem: this.treeItem.toJSON(context),
      treeItemPath: this.treeItem.getPath(),
      treeItemIndex: this.treeItemIndex,
    }
    return j
  }

  /**
   * Reconstructs `TreeItem` like parameter from JSON object.
   *
   * @param {object} j -The j treeItem
   * @param {object} context - The context treeItem
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>) {
    const treeItem = <TreeItem>Registry.constructClass(j.treeItem.type)
    if (!treeItem) {
      console.warn('resolvePath is unable to construct', j.treeItem)
      return
    }
    this.name = j.name
    this.treeItem = treeItem

    this.treeItem.fromJSON(j.treeItem, context)
    this.treeItemIndex = this.owner.getChildIndex(this.owner.addChild(this.treeItem))
  }

  /**
   * Removes reference of the `TreeItem` from current change.
   */
  destroy() {
  }
}

UndoRedoManager.registerChange('TreeItemAddChange', TreeItemAddChange)

export { TreeItemAddChange }
