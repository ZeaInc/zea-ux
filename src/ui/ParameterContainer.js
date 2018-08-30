class ParameterContainer {
  constructor(rootElement, parameterOwner){
    this.rootElement = rootElement;
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.rootElement.appendChild(this.container);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer';
    this.container.appendChild(this.ul);

    this.widgets = [];
    for(let parameter of parameterOwner.getParameters()) {
       this.addParameterWidget(parameter)
    }
  }

  getDomElement() {
    return this.container;
  }

  addParameterWidget(parameter, widget) {


    var li = document.createElement("li");
    this.ul.appendChild(li);

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', parameter.getName() );
    labelElem.appendChild(document.createTextNode(parameter.getName()));
    li.appendChild(labelElem);
    
    const widget = parameterWidgetFactory.constructWidget(parameter, li);
    if(!widget) {
      console.warn("Unable to display parameter:" + parameter.getName())
      return
    }
    this.widgets.push(widget);
  }
}