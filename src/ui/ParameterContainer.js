import visualiveUxFactory from '../ui/VisualiveUxFactory';

class ParameterContainer {
  constructor(parameterOwner, domElement) {
    this.domElement = domElement;
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

  destroy() {
    this.domElement.innerHTML = '';
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

    const li = document.createElement('li');
    this.ul.appendChild(li);

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', parameterName);
    labelElem.appendChild(document.createTextNode(parameterName));
    li.appendChild(labelElem);

    const widget = visualiveUxFactory.constructWidget(parameter, li);
    if (!widget) {
      console.warn(`Unable to display parameter '${parameterName}'`);
      return;
    }
    this.widgets.push(widget);
  }
}

export default ParameterContainer;
