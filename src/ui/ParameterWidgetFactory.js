class ParameterWidgetFactory {
  constructor() {
    this.factories = [];
  }

  registerWidget(widget, rule) {
    this.factories.push({ widget, rule });
  }

  constructWidget(param, parentElement) {
    // Note: Iterate over the factories in reverse order.
    // This allows widgets to override existing widgets in special cases.
    // E.g. display a custom color picker in VR compared to the
    // material editor.
    for (let i = this.factories.length; i-- > 0; ) {
      const reg = this.factories[i];
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
