import { Color, BaseItem, TreeItem, SelectionSet, CloneContext } from '@zeainc/zea-engine'
import SelectionGroupXfoOperator from './SelectionGroupXfoOperator.js'

/**
 * A specific type of `SelectionSet` class that contains/handles selection of one or more items from the scene.
 *
 * **Option parameter values**
 *
 * | Option | type | default | Description |
 * | --- | --- | --- | --- |
 * | selectionOutlineColor | `Color` | `new Color('#03e3ac'))`  and opacity of `0.1` | See `Color` documentation |
 * | branchSelectionOutlineColor | `Color` | `new Color('#81f1d5')` and opacity of `0.55` | See `Color` documentation |
 *
 * @extends {SelectionSet}
 */
class SelectionGroup extends SelectionSet {
  selectionGroupXfoOp: SelectionGroupXfoOperator

  /**
   * Creates an instance of SelectionGroup.
   *
   *
   * **Parameters**
   * @param options - Custom options for selection
   */
  constructor(options?: Record<string, any>) {
    super()

    const selectionColor = options.selectionOutlineColor
      ? options.selectionOutlineColor
      : new Color(3 / 255, 227 / 255, 172 / 255, 0.1)
    this.highlightColorParam.value = selectionColor
    this.itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(this.globalXfoParam)
  }

  /**
   * Constructs a new selection group by copying the values from current one and returns it.
   *
   * @return - Cloned selection group.
   */
  clone(context?: CloneContext): BaseItem {
    const cloned = new SelectionGroup()
    cloned.copyFrom(this, context)
    return cloned
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  bindItem(item: TreeItem, index: number): void {
    const highlightColor = this.highlightColorParam.value
    highlightColor.a = this.highlightFillParam.value
    item.addHighlight('selected' + this.getId(), highlightColor, true)
    this.selectionGroupXfoOp.addItem(item)
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  unbindItem(item: TreeItem, index: number): void {
    item.removeHighlight('selected' + this.getId(), true)
    this.selectionGroupXfoOp.removeItem(item)
  }
}

export default SelectionGroup
export { SelectionGroup }
