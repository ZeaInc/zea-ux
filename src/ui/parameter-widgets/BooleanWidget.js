import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class BooleanWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);
    console.log("BooleanWidget", parameter.getName(), parameter.getValue())
    const input = document.createElement('input');
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'checkbox');
    input.setAttribute('tabindex', 0);
    input.checked = parameter.getValue();

    parentDomElem.appendChild(input);

    /////////////////////////////
    // Handle Changes.

    let settingParameterValue = false;
    parameter.valueChanged.connect(() => {
      if (!settingParameterValue)
        input.checked = parameter.getValue();
    });
    input.addEventListener('input', () => {
      settingParameterValue = true;
      const change = new ParameterValueChange(parameter);
      change.setValue(input.checked);
      undoRedoManager.addChange(change);
      settingParameterValue = false;
    });
  }
}

visualiveUxFactory.registerWidget(
  BooleanWidget,
  p => p.constructor.name == 'BooleanParameter'
);