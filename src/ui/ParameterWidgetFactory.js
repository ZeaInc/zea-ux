class ParameterWidgetFactory {
  constructor() {
    this.treeItemFactories = [];
    this.widgetFactories = [];
  }

  registerTreeItemElement(treeItemElement, rule) {
    this.treeItemFactories.push({ treeItemElement, rule });
  }

  constructTreeItemElement(treeItem, parentElement) {
    // Note: Iterate over the factories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    for (let i = this.treeItemFactories.length; i-- > 0; ) {
      const reg = this.treeItemFactories[i];
      if (reg.rule(treeItem)) {
        return new reg.treeItemElement(treeItem, parentElement);
      }
    }

    console.warn(
      `Tree item Factory not found for parameter '${treeItem.getName()}' of class '${
        treeItem.constructor.name
      }'`
    );
  }

  registerWidget(widget, rule) {
    this.widgetFactories.push({ widget, rule });
  }

  constructWidget(param, parentElement) {
    // Note: Iterate over the widgetFactories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    for (let i = this.widgetFactories.length; i-- > 0; ) {
      const reg = this.widgetFactories[i];
      if (reg.rule(param)) {
        return new reg.widget(param, parentElement);
      }
    }

    console.warn(
      `Widget Factory not found for parameter '${param.getName()}' of class '${
        param.constructor.name
      }'`
    );
  }
}

const parameterWidgetFactory = new ParameterWidgetFactory();

export default parameterWidgetFactory;
