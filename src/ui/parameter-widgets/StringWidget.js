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
    input.addEventListener('input', () => {
      if (!change) {
        change = new ParameterValueChange(parameter);
        undoRedoManager.addChange(change);
      }
      change.setValue(input.valueAsNumber);
    });
    input.addEventListener('change', () => {
      if (!change) {
        change = new ParameterValueChange(parameter);
        undoRedoManager.addChange(change);
      }
      change.setValue(input.valueAsNumber);
      change = undefined;
    });
  }
}

visualiveUxFactory.registerWidget(
  StringWidget,
  p => p.constructor.name == 'StringParameter'
);
