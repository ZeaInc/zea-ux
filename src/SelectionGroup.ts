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
  initialXfoModeParam = new MultiChoiceParameter('InitialXfoMode', GROUP_XFO_MODES.average, [
    'manual',
    'first',
    'average',
    'global',
  ])
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

    this.highlightColorParam.value = selectionColor
    this.addParameter(new ColorParameter('SubtreeHighlightColor', subtreeColor))

    this.itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.addParameter(this.initialXfoModeParam)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(this.initialXfoModeParam, this.globalXfoParam)
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
   * @return - Cloned selection group.
   */
  clone(): SelectionGroup {
    const cloned = new SelectionGroup()
    cloned.copyFrom(this)
    return cloned
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  bindItem(item: TreeItem, index: number): void {
    if (item instanceof TreeItem) {
      const highlightColor = this.highlightColorParam.value
      highlightColor.a = this.highlightFillParam.value
      item.addHighlight('selected' + this.getId(), highlightColor, false)

      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue()
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) {
          childItem.addHighlight('branchselected' + this.getId(), subTreeColor, true)
        }
      })

      this.selectionGroupXfoOp.addItem(item)
    }
  }

  /**
   *
   * @param item -
   * @param index -
   * @private
   */
  unbindItem(item: TreeItem, index: number): void {
    if (item instanceof TreeItem) {
      item.removeHighlight('selected' + this.getId())
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem) {
          childItem.removeHighlight('branchselected' + this.getId(), true)
        }
      })

      this.selectionGroupXfoOp.removeItem(item)
    }
  }
}

export default SelectionGroup
export { SelectionGroup }
