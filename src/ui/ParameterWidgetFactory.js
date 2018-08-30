class ParameterWidgetFactory {
  constructor() {
    this.factories = [];
  }

  registerWidget(widget, rule) {
    this.factories.push({ widget, rule })
  }

  constructWidget(param, parentEelement) {
    // Note: Iterate over the factories in reverse order. 
    // This allows widgets to override existing widgets in speical cases.
    // E.g. display a custom color picker in VR compared to the 
    // material editor.
    const i = this.factories.length;
    while(i) {
      const reg = this.factories[i];
      if(reg.rule(param)) {
        return new reg.widget(param, parentEelement);
      }
    }
    console.warn("Widget Factory not found for parameter:" + param.getName() + " of class:" + param.constructor.name)
  }

}

const parameterWidgetFactory = new ParameterWidgetFactory();