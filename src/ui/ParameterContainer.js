class ParameterContainer {
  constructor(rootElement){
    this.rootElement = rootElement;
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.rootElement.appendChild(this.container);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer';
    this.container.appendChild(this.ul);

    this.widgets = [];
  }
  getDomElement() {
    return this.container;
  }

  addWidget(widget) {
    var li = document.createElement("li");
    this.ul.appendChild(li);
    widget.setParentDomElem(li);
    this.widgets.push(widget);
  }
}