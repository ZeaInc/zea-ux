import BaseWidget from './BaseWidget.js';

import ParameterValueChange from '../../undoredo/ParameterValueChange.js';
import visualiveUxFactory from '../VisualiveUxFactory.js';



export default class StringWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', parameter.getValue());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    /////////////////////////////
    // Handle Changes.

    let change;
    parameter.valueChanged.connect(() => {
      if (!change) input.value = parameter.getValue();
    });

    const valueChange = () => {
      const value = input.value
      if (!change) {
        change = new ParameterValueChange(parameter, value);
        undoRedoManager.addChange(change);
      }
      else {
        change.update({ value });
      }
    };

    const valueChangeEnd = () => {
      valueChange();
      change = undefined;
    };

    input.addEventListener('input', valueChange);
    input.addEventListener('change', valueChangeEnd);
  }
}

visualiveUxFactory.registerWidget(
  StringWidget,
  p => p.constructor.name == 'StringParameter'
);
