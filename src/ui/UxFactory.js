/** Class representing a UX factory. */
class UxFactory {
  /**
   * Create a UX factory.
   */
  constructor() {
    this.treeItemFactories = []
    this.widgetFactories = []
    this.inspectorFactories = []
  }

  /**
   * The registerInpector method.
   * @param {any} inspector - The inspector param.
   * @param {any} rule - The rule param.
   */
  registerInpector(inspector, rule) {
    this.inspectorFactories.push({ inspector, rule })
  }

  /**
   * The constructInspector method.
   * @param {...object} ...args - The ...args param
   * @return {any} The return value.
   */
  constructInspector(...args) {
    // Note: Iterate over the factories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    const baseItem = args[0]
    for (let i = this.inspectorFactories.length; i-- > 0; ) {
      const reg = this.inspectorFactories[i]
      if (reg.rule(baseItem)) {
        return new reg.inspector(...args)
      }
    }

    console.warn(
      `Inspector factory not found for parameter '${baseItem.getName()}' of class '${
        baseItem.constructor.name
      }'`
    )
  }

  /**
   * The registerTreeItemElement method.
   * @param {any} treeItemElement - The treeItemElement param.
   * @param {any} rule - The rule param.
   */
  registerTreeItemElement(treeItemElement, rule) {
    this.treeItemFactories.push({ treeItemElement, rule })
  }

  /**
   * The constructTreeItemElement method.
   * @param {...object} ...args - The ...args param
   * @return {any} The return value.
   */
  constructTreeItemElement(...args) {
    // Note: Iterate over the factories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    const treeItem = args[0]
    for (let i = this.treeItemFactories.length; i-- > 0; ) {
      const reg = this.treeItemFactories[i]
      if (reg.rule(treeItem)) {
        return new reg.treeItemElement(...args)
      }
    }

    console.warn(
      `Tree item factory not found for parameter '${treeItem.getName()}' of class '${
        treeItem.constructor.name
      }'`
    )
  }

  /**
   * The registerWidget method.
   * @param {any} widget - The treeItemElement param.
   * @param {any} rule - The rule param.
   */
  registerWidget(widget, rule) {
    this.widgetFactories.push({ widget, rule })
  }

  /**
   * The findWidgetReg method.
   * @param {any} param - The param param.
   * @return {any} The return value.
   */
  findWidgetReg(param) {
    for (let i = this.widgetFactories.length; i-- > 0; ) {
      const reg = this.widgetFactories[i]
      if (reg.rule(param)) {
        return reg
      }
    }
  }

  /**
   * The constructWidget method.
   * @param {...object} ...args - The ...args param
   * @return {any} The return value.
   */
  constructWidget(...args) {
    // Note: Iterate over the widgetFactories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    const param = args[0]
    for (let i = this.widgetFactories.length; i-- > 0; ) {
      const reg = this.widgetFactories[i]
      if (reg.rule(param)) {
        return new reg.widget(...args)
      }
    }

    console.warn(
      `Widget factory not found for parameter '${param.getName()}' of class '${
        param.constructor.name
      }'`
    )
  }
}

const uxFactory = new UxFactory()

export default uxFactory
