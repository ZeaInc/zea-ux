import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a boolean widget.
 * @extends BaseWidget
 */
export default class BooleanWidget extends BaseWidget {
  /**
   * Create a boolean widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
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
      if (!change) input.checked = parameter.getValue();
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
