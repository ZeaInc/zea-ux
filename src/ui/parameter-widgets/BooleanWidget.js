import { ValueSetMode, BooleanParameter } from '@zeainc/zea-engine';
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

    // ///////////////////////////
    // Handle Changes.
    
    let change;
    let remoteUserEditedHighlightId;
    parameter.valueChanged.connect(mode => {
      if (!change) {
        input.checked = parameter.getValue();

        if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
          input.classList.add('user-edited');
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId);
          remoteUserEditedHighlightId = setTimeout(() => {
            input.classList.remove('user-edited');
            remoteUserEditedHighlightId = null;
          }, 1500);
        }
      }
    });
    input.addEventListener('input', () => {
      change = new ParameterValueChange(parameter, input.checked);
      appData.undoRedoManager.addChange(change);
      change = undefined;
    });
  }
}

uxFactory.registerWidget(BooleanWidget, p => p instanceof BooleanParameter);
