import { TreeItem, Operator, Registry } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager.js'
import Change from '../Change.js'

/**
 * Class representing an `Add TreeItem` Change. Meaning that this should be called when you add a new `TreeItem` to the scene.
 *
 * @extends Change
 */
class TreeItemAddChange extends Change {
  /**
   * Creates an instance of TreeItemAddChange.
   *
   * @param {TreeItem} treeItem -
   * @param {TreeItem} owner -
   * @param {SelectionManager} selectionManager -
   */
  constructor(treeItem, owner, selectionManager) {
    if (treeItem) {
      super(treeItem.getName() + ' Added')
      this.treeItem = treeItem
      this.owner = owner
      this.selectionManager = selectionManager
      this.prevSelection = new Set(this.selectionManager.getSelection())
      this.treeItemIndex = this.owner.addChild(this.treeItem)
      this.selectionManager.setSelection(new Set([this.treeItem]), false)

      this.treeItem.addRef(this)
    } else {
      super()
    }
  }

  /**
   * Removes the newly added TreeItem from its owner.
   */
  undo() {
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
  redo() {
    // Now re-attach all the detached operators.
    if (this.treeItem instanceof Operator) {
      const op = this.treeItem
      op.reattach()
    } else if (subTreeItem instanceof TreeItem) {
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
  toJSON(context) {
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
  fromJSON(j, context) {
    const treeItem = Registry.constructClass(j.treeItem.type)
    if (!treeItem) {
      console.warn('resolvePath is unable to construct', j.treeItem)
      return
    }
    this.name = j.name
    this.treeItem = treeItem
    this.treeItem.addRef(this)

    this.treeItem.fromJSON(j.treeItem, context)
    this.treeItemIndex = this.owner.addChild(this.treeItem, false, false)
  }

  /**
   * Removes reference of the `TreeItem` from current change.
   */
  destroy() {
    this.treeItem.removeRef(this)
  }
}

UndoRedoManager.registerChange('TreeItemAddChange', TreeItemAddChange)

export { TreeItemAddChange }
