
/** Class representing a selection group */
export default class SelectionGroup extends ZeaEngine.Group {
  constructor(options) {
    super();

    let selectionColor
    let subtreeColor
    if (options.selectionOutlineColor)
      selectionColor = options.selectionOutlineColor;
    else {
      selectionColor = new ZeaEngine.Color('#03E3AC')
      selectionColor.a = 0.1
    }
    if (options.branchSelectionOutlineColor)
      subtreeColor = options.branchSelectionOutlineColor;
    else {
      subtreeColor = selectionColor.lerp(
        new ZeaEngine.Color('white'),
        0.5
      )
      subtreeColor.a = 0.1
    }

    this.getParameter('HighlightColor').setValue(selectionColor)
    this.addParameter(new ZeaEngine.ColorParameter('SubtreeHighlightColor', subtreeColor))
    
    this.propagatingSelectionToItems = options.setItemsSelected != false;
    this.getParameter('InitialXfoMode').setValue(ZeaEngine.Group.INITIAL_XFO_MODES.average);
    this.__itemsParam.setFilterFn(item => item instanceof ZeaEngine.BaseItem)
  }

  clone(flags) {
    const cloned = new SelectionGroup();
    cloned.copyFrom(this, flags);
    return cloned;
  }

  rebindInitialXfos() {
    const items = Array.from(this.__itemsParam.getValue());
    items.forEach((item, index) => {
      if (item instanceof ZeaEngine.TreeItem) {
        this.__initialXfos[index] = item.getGlobalXfo();
      }
    })
  }

  /**
   * The getSelectionOutlineColor method.
   * @return {any} - The return value.
  getSelectionOutlineColor() {
    return this.selectionOutlineColor
  }
   */

  /**
   * The setSelectionOutlineColor method.
   * @param {any} color - The color param.
  setSelectionOutlineColor(color) {
    this.selectionOutlineColor = color
    subtreeColor = color.lerp(
      new Color('white'),
      0.5
    )
    subtreeColor.a = 0.1
  }
   */

  // eslint-disable-next-line require-jsdoc
  __bindItem(item, index) {

    if (this.propagatingSelectionToItems)
      item.setSelected(this);
    
    const signalIndices = {}
    
    if (item instanceof ZeaEngine.TreeItem) {
      const highlightColor = this.getParameter('HighlightColor').getValue()
      highlightColor.a = this.getParameter('HighlightFill').getValue()
      const subTreeColor = this.getParameter('SubtreeHighlightColor').getValue()
      item.addHighlight('selected' + this.getId(), highlightColor, false)
      item.getChildren().forEach(childItem => {
        if (childItem instanceof ZeaEngine.TreeItem)
          childItem.addHighlight(
            'branchselected' + this.getId(),
            subTreeColor,
            true
          )
      })

      signalIndices.globalXfoChangedIndex = item.globalXfoChanged.connect((mode) => {
        // Then the item xfo changes, we update the group xfo.
        if (!this.calculatingGroupXfo && !this.propagatingXfoToItems) {
          this.__initialXfos[index] = item.getGlobalXfo();
          this._setGlobalXfoDirty();
        }
        // else if (mode != ValueSetMode.OPERATOR_SETVALUE &&  mode != ValueSetMode.OPERATOR_DIRTIED)
      });
      this.__initialXfos[index] = item.getGlobalXfo();
    }

    this.__signalIndices[index] = signalIndices
  }

  // eslint-disable-next-line require-jsdoc
  __unbindItem(item, index) {
    if (this.propagatingSelectionToItems)
      item.setSelected(false);
    
    if (item instanceof ZeaEngine.TreeItem) {
      item.removeHighlight('selected' + this.getId())
      item.getChildren().forEach(childItem => {
        if (childItem instanceof ZeaEngine.TreeItem)
          childItem.removeHighlight('branchselected' + this.getId(), true)
      })

      item.globalXfoChanged.disconnectId(this.__signalIndices[index].globalXfoChangedIndex);
      
      this.__initialXfos.splice(index, 1);
    }
    
    this.__signalIndices.splice(index, 1);
  }

  /**
   * The _propagateDirtyXfoToItems method.
   * @private
   */
  _propagateDirtyXfoToItems() {
    if (this.calculatingGroupXfo) return

    const items = Array.from(this.__itemsParam.getValue())
    // Only after all the items are resolved do we have an invXfo and we can tranform our items.
    if (
      !this.calculatingGroupXfo &&
      items.length > 0 &&
      this.invGroupXfo &&
      !this.dirty
    ) {
      const xfo = this.__globalXfoParam.getValue()
      const delta = xfo.multiply(this.invGroupXfo)

      this.propagatingXfoToItems = true // Note: selection group needs this set.
      const setGlobal = (item, initialXfo) => {
        const param = item.getParameter('GlobalXfo');
        const result = delta.multiply(initialXfo);
        param.setValue(result);
      };
      items.forEach((item, index) => {
        if (item instanceof ZeaEngine.TreeItem) {
          setGlobal(item, this.__initialXfos[index])
        }
      });
      this.propagatingXfoToItems = false
    }
  }

};