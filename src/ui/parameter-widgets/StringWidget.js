import BaseWidget from './BaseWidget.js';

import ParameterValueChange from '../../undoredo/ParameterValueChange.js';
import uxFactory from '../UxFactory.js';

/**
 * Class representing a string widget.
 * @extends BaseWidget
 */
export default class StringWidget extends BaseWidget {
  /**
   * Create a string widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', parameter.getValue());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    // ///////////////////////////
    // Handle Changes.

    let change;
    let remoteUserEditedHighlightId;
    parameter.valueChanged.connect(() => {
      if (!change) {
        input.value = parameter.getValue();
        
        if (mode == ZeaEngine.ValueSetMode.REMOTEUSER_SETVALUE) {
          input.classList.add('user-edited');
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId);
          remoteUserEditedHighlightId = setTimeout(() => {
            input.classList.remove('user-edited');
            remoteUserEditedHighlightId = null
          }, 1500);
        }
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
  p => p instanceof ZeaEngine.StringParameter
);
