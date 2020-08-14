import { Color, ColorParameter, BaseItem, TreeItem, Group } from '@zeainc/zea-engine'
import SelectionGroupXfoOperator from './SelectionGroupXfoOperator.js'

/**
 * A specific type of `Group` class that contains/handles selection of one or more items from the scene.
 *
 * **Option parameter values**
 *
 * | Option | type | default | Description |
 * | --- | --- | --- | --- |
 * | selectionOutlineColor | `Color` | `new Color('#03e3ac'))`  and opacity of `0.1` | See `Color` documentation |
 * | branchSelectionOutlineColor | `Color` | `new Color('#81f1d5')` and opacity of `0.55` | See `Color` documentation |
 *
 * @extends {Group}
 */
class SelectionGroup extends Group {
  /**
   * Creates an instance of SelectionGroup.
   *
   *
   * **Parameters**
   * @param {object} options - Custom options for selection
   */
  constructor(options) {
    super()

    let selectionColor
    let subtreeColor
    options.selectionOutlineColor
      ? (selectionColor = options.selectionOutlineColor)
      : (selectionColor = new Color(3, 227, 172, 0.1))

    if (options.branchSelectionOutlineColor) subtreeColor = options.branchSelectionOutlineColor
    else {
      subtreeColor = selectionColor.lerp(new Color('white'), 0.5)
      subtreeColor.a = 0.1
    }

    this.getParameter('HighlightColor').setValue(selectionColor)
    this.addParameter(new ColorParameter('SubtreeHighlightColor', subtreeColor))

    this.getParameter('InitialXfoMode').setValue(Group.INITIAL_XFO_MODES.average)
    this.__itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(
      this.getParameter('InitialXfoMode'),
      this.getParameter('GlobalXfo')
    )
  }

  /**
   * Constructs a new selection group by copying the values from current one and returns it.
   *
   * @return {SelectionGroup} - Cloned selection group.
   */
  clone() {
    const cloned = new SelectionGroup()
    cloned.copyFrom(this)
    return cloned
  }

  /**
   *
   * @param {TreeItem} item -
   * @param {number} index -
   * @private
   */
  __bindItem(item, index) {
    if (item instanceof TreeItem) {
      const highlightColor = this.getParameter('HighlightColor').getValue()
      highlightColor.a = this.getParameter('HighlightFill').getValue()
      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue()
      item.addHighlight('selected' + this.getId(), highlightColor, false)
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) childItem.addHighlight('branchselected' + this.getId(), subTreeColor, true)
      })

      this.selectionGroupXfoOp.addItem(item, index)
    }
  }

  /**
   *
   * @param {TreeItem} item -
   * @param {number} index -
   * @private
   */
  __unbindItem(item, index) {
    if (item instanceof TreeItem) {
      item.removeHighlight('selected' + this.getId())
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) childItem.removeHighlight('branchselected' + this.getId(), true)
      })

      this.selectionGroupXfoOp.removeItem(item, index)
    }
  }

  /**
   * calc Group Xfo
   * @private
   */
  calcGroupXfo() {}
}

export default SelectionGroup
export { SelectionGroup }
