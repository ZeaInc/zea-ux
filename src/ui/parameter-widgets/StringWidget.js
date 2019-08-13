import BaseWidget from './BaseWidget.js';

import ParameterValueChange from '../../undoredo/ParameterValueChange.js';
import uxFactory from '../UxFactory.js';

export default class StringWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', parameter.getValue());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    /////////////////////////////
    // SceneWidget Changes.

    let change;
    parameter.valueChanged.connect(() => {
      if (!change) {
        input.value = parameter.getValue();
      }
    });

    const valueChange = () => {
      const value = input.value;
      if (!change) {
        change = new ParameterValueChange(parameter, value);
        appData.undoRedoManager.addChange(change);
      } else {
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

uxFactory.registerWidget(
  StringWidget,
  p => p instanceof Visualive.StringParameter
);
