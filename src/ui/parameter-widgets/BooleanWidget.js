import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class BooleanWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);
    const input = document.createElement('input');
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'checkbox');
    input.setAttribute('tabindex', 0);
    input.checked = parameter.getValue();

    parentDomElem.appendChild(input);

    /////////////////////////////
    // SceneWidget Changes.

    let change;
    parameter.valueChanged.connect(() => {
      if (!change)
        input.checked = parameter.getValue();
    });
    input.addEventListener('input', () => {
      change = new ParameterValueChange(parameter, input.checked);
      appData.undoRedoManager.addChange(change);
      change = undefined;
    });
  }
}

uxFactory.registerWidget(
  BooleanWidget,
  p => p instanceof Visualive.BooleanParameter
);
