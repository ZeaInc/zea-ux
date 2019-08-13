// import * as Visualive from '@visualive/engine';

import BaseWidget from './BaseWidget.js';
import NameWidget from './NameWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterContainer from '../parameter-container.js';

export default class ParameterOwnerWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const parameteOwner = parameter.getValue();

    const ul = document.createElement('ul');
    ul.className = 'list pa0';
    const linameWidget = document.createElement('li');
    const liparameterContainer = document.createElement('li');
    parentDomElem.appendChild(ul);
    ul.appendChild(linameWidget);
    ul.appendChild(liparameterContainer);
    if (parameteOwner instanceof Visualive.BaseItem)
      this.nameWidget = new NameWidget(parameteOwner, linameWidget, appData);
    this.parameterContainer = new ParameterContainer(
      parameteOwner,
      liparameterContainer,
      appData
    );

    parameter.valueChanged.connect(() => {
      this.parameterContainer.setParameterOwner(parameter.getValue());
    });
  }
}

uxFactory.registerWidget(
  ParameterOwnerWidget,
  p => p.getValue() instanceof Visualive.ParameterOwner
);
