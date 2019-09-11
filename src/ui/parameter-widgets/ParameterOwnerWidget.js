import BaseWidget from './BaseWidget.js';
import NameWidget from './NameWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterContainer from '../parameter-container.js';

/**
 * Class representing a parameter owner widget.
 * @extends BaseWidget
 */
export default class ParameterOwnerWidget extends BaseWidget {
  /**
   * Create a parameter owner widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
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
    if (parameteOwner instanceof ZeaEngine.BaseItem)
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
  p => p.getValue() instanceof ZeaEngine.ParameterOwner
);
