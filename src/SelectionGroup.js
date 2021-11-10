import { Color, ColorParameter, BaseItem, TreeItem, SelectionSet, MultiChoiceParameter } from '@zeainc/zea-engine'
import SelectionGroupXfoOperator from './SelectionGroupXfoOperator.js'

const GROUP_XFO_MODES = {
  disabled: 0,
  manual: 1,
  first: 2,
  average: 3,
  globalOri: 4,
}

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
class SelectionGroup extends SelectionSet {
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
      : (selectionColor = new Color(3 / 255, 227 / 255, 172 / 255, 0.1))

    if (options.branchSelectionOutlineColor) subtreeColor = options.branchSelectionOutlineColor
    else {
      subtreeColor = selectionColor.lerp(new Color('white'), 0.5)
      subtreeColor.a = 0.1
    }

    this.getParameter('HighlightColor').setValue(selectionColor)
    this.addParameter(new ColorParameter('SubtreeHighlightColor', subtreeColor))

    this.itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.initialXfoModeParam = new MultiChoiceParameter('InitialXfoMode', GROUP_XFO_MODES.average, [
      'manual',
      'first',
      'average',
      'global',
    ])

    this.addParameter(this.initialXfoModeParam)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(
      this.getParameter('InitialXfoMode'),
      this.getParameter('GlobalXfo')
    )
  }

  /**
   * Returns enum of available xfo modes.
   *
   * | Name | Default |
   * | --- | --- |
   * | manual | <code>0</code> |
   * | first | <code>1</code> |
   * | average | <code>2</code> |
   * | globalOri | <code>3</code> |
   */
  static get INITIAL_XFO_MODES() {
    return GROUP_XFO_MODES
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
  bindItem(item, index) {
    if (item instanceof TreeItem) {
      const highlightColor = this.getParameter('HighlightColor').getValue()
      highlightColor.a = this.getParameter('HighlightFill').getValue()
      item.addHighlight('selected' + this.getId(), highlightColor, false)

      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue()
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) {
          childItem.addHighlight('branchselected' + this.getId(), subTreeColor, true)
        }
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
  unbindItem(item, index) {
    if (item instanceof TreeItem) {
      item.removeHighlight('selected' + this.getId())
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) {
          childItem.removeHighlight('branchselected' + this.getId(), true)
        }
      })

      this.selectionGroupXfoOp.removeItem(item, index)
    }
  }
}

export default SelectionGroup
export { SelectionGroup }
