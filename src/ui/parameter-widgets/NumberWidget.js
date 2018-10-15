import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class NumberWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const range = parameter.getRange();
    let input = document.createElement('input');
    if (range) {
      input.className = 'mdl-slider mdl-js-slider';
      input.setAttribute('id', parameter.getName());
      input.setAttribute('type', 'range');
      input.setAttribute('min', range[0]);
      input.setAttribute('max', range[1]);
      input.setAttribute('value', parameter.getValue());
      const step = parameter.getStep();
      if (step) input.setAttribute('step', step);
      input.setAttribute('tabindex', 0);
    } else {
      input.className = 'mdl-textfield__input';
      input.setAttribute('id', parameter.getName());
      input.setAttribute('type', 'number');
      input.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?');
      input.setAttribute('value', parameter.getValue());
      input.setAttribute('tabindex', 0);
    }
    parentDomElem.appendChild(input);

    /////////////////////////////
    // Handle Changes.

    let change = undefined;

    parameter.valueChanged.connect(() => {
      if (!change) input.value = parameter.getValue();
    });

    const valueChange = () => {
      const value = input.valueAsNumber
      if (!change) {
        change = new ParameterValueChange(parameter, value);
        undoRedoManager.addChange(change);
      }
      else {
        undoRedoManager.updateChange({ value });
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
  NumberWidget,
  p => p instanceof Visualive.NumberParameter
);
