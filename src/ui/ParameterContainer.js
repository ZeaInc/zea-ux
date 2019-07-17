import uxFactory from '../ui/UxFactory.js';

class ParameterContainer {
  constructor(parameterOwner, domElement, appData) {
    this.domElement = domElement;
    this.clean();
    this.appData = appData;

    this.container = document.createElement('div');
    this.container.className = 'container';
    this.domElement.appendChild(this.container);

    this.ul = document.createElement('ul');
    this.ul.className = 'flex-outer';
    this.container.appendChild(this.ul);

    if (parameterOwner) {
      this.setParameterOwner(parameterOwner);
    }
  }
  
  clean(){
    while (this.domElement.firstChild) {
        this.domElement.removeChild(this.domElement.firstChild);
    }
  }

  destroy() {
    this.clean();
  }

  getDomElement() {
    return this.container;
  }

  setParameterOwner(parameterOwner) {
    this.parameterOwner = parameterOwner;

    this.widgets = [];
    if (parameterOwner) {
      for (let parameter of parameterOwner.getParameters()) {
        this.addParameterWidget(parameter);
      }
    }
  }

  addParameterWidget(parameter) {
    const parameterName = parameter.getName();
    const reg = uxFactory.findWidgetReg(parameter);
    if (!reg) {
      console.warn(`Unable to display parameter '${parameterName}', value:${parameter.getValue()}`);
      const reg = uxFactory.findWidgetReg(parameter);
      return;
    }

    const li = document.createElement('li');
    this.ul.appendChild(li);

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', parameterName);
    labelElem.appendChild(document.createTextNode(parameterName));
    li.appendChild(labelElem);

    const widget = new reg.widget(parameter, li, this.appData);
    this.widgets.push(widget);
  }
}

export default ParameterContainer;
export {
  ParameterContainer
};
