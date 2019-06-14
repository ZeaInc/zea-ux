// import * as Visualive from '@visualive/engine';

import BaseWidget from './BaseWidget.js';
import StringWidget from './StringWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterContainer from '../ParameterContainer.js';  

class NameParam {
  constructor(treeItem) {
    this._treeItem = treeItem;
    this.valueChanged = treeItem.nameChanged;
  }

  getName() {
    return "Name"
  }

  getValue() {
    return this._treeItem.getName();
  }

  setValue(name) {
    return this._treeItem.setName(name);
  }
}

export default class ParameterOwnerWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const parameteOwner = parameter.getValue();

    const ul = document.createElement('ul');
    ul.className = 'list pa0'
    const linameWidget = document.createElement('li');
    const liparameterContainer = document.createElement('li');
    parentDomElem.appendChild(ul);
    ul.appendChild(linameWidget);
    ul.appendChild(liparameterContainer);
    if(parameteOwner instanceof Visualive.BaseItem)
      this.nameWidget = new StringWidget(new NameParam(parameteOwner), linameWidget, undoRedoManager);
    this.parameterContainer = new ParameterContainer(parameteOwner, liparameterContainer, undoRedoManager);

    parameter.valueChanged.connect(() => {
      this.parameterContainer.setParameterOwner(parameter.getValue());
    });
  }
}

visualiveUxFactory.registerWidget(
  ParameterOwnerWidget,
  p => p.getValue() instanceof Visualive.ParameterOwner
);
