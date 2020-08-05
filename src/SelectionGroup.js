import {
  Color,
  ColorParameter,
  BaseItem,
  TreeItem,
  Group,
} from '@zeainc/zea-engine'

import SelectionGroupXfoOperator from './SelectionGroupXfoOperator.js'

/** Class representing a selection group */
export default class SelectionGroup extends Group {
  constructor(options) {
    super()

    let selectionColor
    let subtreeColor
    if (options.selectionOutlineColor)
      selectionColor = options.selectionOutlineColor
    else {
      selectionColor = new Color('#03E3AC')
      selectionColor.a = 0.1
    }
    if (options.branchSelectionOutlineColor)
      subtreeColor = options.branchSelectionOutlineColor
    else {
      subtreeColor = selectionColor.lerp(new Color('white'), 0.5)
      subtreeColor.a = 0.1
    }

    this.getParameter('HighlightColor').setValue(selectionColor)
    this.addParameter(new ColorParameter('SubtreeHighlightColor', subtreeColor))

    this.getParameter('InitialXfoMode').setValue(
      Group.INITIAL_XFO_MODES.average
    )
    this.__itemsParam.setFilterFn((item) => item instanceof BaseItem)

    this.selectionGroupXfoOp = new SelectionGroupXfoOperator(
      this.getParameter('InitialXfoMode'),
      this.getParameter('GlobalXfo')
    )
  }

  clone(flags) {
    const cloned = new SelectionGroup()
    cloned.copyFrom(this, flags)
    return cloned
  }

  // eslint-disable-next-line require-jsdoc
  __bindItem(item, index) {
    if (item instanceof TreeItem) {
      const highlightColor = this.getParameter('HighlightColor').getValue()
      highlightColor.a = this.getParameter('HighlightFill').getValue()
      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue()
      item.addHighlight('selected' + this.getId(), highlightColor, false)
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem)
          childItem.addHighlight(
            'branchselected' + this.getId(),
            subTreeColor,
            true
          )
      })

      this.selectionGroupXfoOp.addItem(item, index)
    }
  }

  // eslint-disable-next-line require-jsdoc
  __unbindItem(item, index) {
    if (item instanceof TreeItem) {
      item.removeHighlight('selected' + this.getId())
      item.getChildren().forEach((childItem) => {
        if (childItem instanceof TreeItem)
          childItem.removeHighlight('branchselected' + this.getId(), true)
      })

      this.selectionGroupXfoOp.removeItem(item, index)
    }
  }

  calcGroupXfo() {}
}
