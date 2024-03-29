import UndoRedoManager from '../UndoRedoManager'
import Change from '../Change'
import { TreeItem } from '@zeainc/zea-engine'

/**
 * Class representing a change of visibility state for selected items.
 *
 * @extends Change
 */
class SelectionVisibilityChange extends Change {
  selection: Set<TreeItem>
  state: boolean
  /**
   * Create a toggle selection visibility.
   *
   * @param selection - The selection value.
   * @param state - The state value.
   */
  constructor(selection: Set<TreeItem>, state: boolean) {
    super('Selection Visibility Change')

    if (!selection || typeof state !== 'boolean') return

    this.selection = selection
    this.state = state
    this._changeItemsVisibility(this.state)
  }

  /**
   * Restores previous visibility status of the selected items
   */
  undo(): void {
    this._changeItemsVisibility(!this.state)
  }

  /**
   * Recreates previous visibility status of the selected items
   */
  redo(): void {
    this._changeItemsVisibility(this.state)
  }

  /**
   * Changes items visibility.
   *
   * @param state - The state param.
   * @private
   */
  _changeItemsVisibility(state: boolean): void {
    for (const treeItem of this.selection) {
      treeItem.getParameter('Visible').value = state
    }
  }
}

UndoRedoManager.registerChange('ToggleSelectionVisibility', SelectionVisibilityChange)

export default SelectionVisibilityChange
export { SelectionVisibilityChange }
