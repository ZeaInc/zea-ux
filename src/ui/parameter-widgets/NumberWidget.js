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
      input.setAttribute('min', 0);
      input.setAttribute('max', 200);
      console.log("value:", parameter.getValue())
      const value = ((parameter.getValue() - range[0]) / (range[1] - range[0]) * 200)
      input.setAttribute('value', value);
      const step = parameter.getStep();
      if (step) input.setAttribute('step', step);
      else {
        input.setAttribute('step', 1);
      }
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
    // SceneWidget Changes.

    let change = undefined;

    parameter.valueChanged.connect(() => {
      if (!change){
        if (range)
          input.value = ((parameter.getValue() - range[0]) / (range[1] - range[0]) * 200)
        else
          input.value = parameter.getValue();
      } 
    });

    const valueChange = () => {
      let value = input.valueAsNumber;
      if (range)
        value = range[0] + ((value / 200) * (range[1] - range[0]));
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
  NumberWidget,
  p => p instanceof Visualive.NumberParameter
);
