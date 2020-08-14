import UndoRedoManager from '../UndoRedoManager'
import Change from '../Change'

/**
 * Represents a `Change` class for storing `Selection` values.
 *
 * @extends Change
 */
class SelectionChange extends Change {
  /**
   * Creates an instance of SelectionChange.
   *
   * @param {SelectionManager} selectionManager - The selectionManager value.
   * @param {Set} prevSelection - The prevSelection value.
   * @param {Set} newSelection - The newSelection value.
   */
  constructor(selectionManager, prevSelection, newSelection) {
    super('SelectionChange')
    this.__selectionManager = selectionManager
    this.__prevSelection = prevSelection
    this.__newSelection = newSelection
  }

  /**
   * Sets the state of selections to the previous list of items selected.
   */
  undo() {
    this.__selectionManager.setSelection(this.__prevSelection, false)
  }

  /**
   * Restores the state of the selections to the latest the list of items selected.
   */
  redo() {
    this.__selectionManager.setSelection(this.__newSelection, false)
  }

  /**
   * Serializes selection values as a JSON object, allowing persistence/replication.
   *
   * @param {object} context - The appData param.
   * @return {object} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context)

    const itemPaths = []
    for (const treeItem of this.__newSelection) {
      itemPaths.push(treeItem.getPath())
    }
    j.itemPaths = itemPaths
    return j
  }

  /**
   * Restores selection state from a JSON object.
   *
   * @param {object} j - The j param.
   * @param {object} context - The context param.
   */
  fromJSON(j, context) {
    super.fromJSON(j, context)

    this.__selectionManager = context.appData.selectionManager
    this.__prevSelection = new Set(this.__selectionManager.getSelection())

    const sceneRoot = context.appData.scene.getRoot()
    const newSelection = new Set()
    for (const itemPath of j.itemPaths) {
      newSelection.add(sceneRoot.resolvePath(itemPath, 1))
    }
    this.__newSelection = newSelection

    this.__selectionManager.setSelection(this.__newSelection, false)
  }
}

UndoRedoManager.registerChange('SelectionChange', SelectionChange)

export default SelectionChange
export { SelectionChange }
