import { MultiChoiceParameter, ValueSetMode } from '@zeainc/zea-engine';
import BaseWidget from './BaseWidget.js';
import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a multi choice widget.
 * @extends BaseWidget
 */
export default class MultiChoiceWidget extends BaseWidget {
  /**
   * Create a multi choice widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const choices = parameter.getChoices();
    const select = document.createElement('select');
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(choice));
      select.appendChild(option);
    }
    select.selectedIndex = parameter.getValue();

    parentDomElem.appendChild(select);

    // ///////////////////////////
    // Handle Changes

    let changing = false;
    let remoteUserEditedHighlightId;
    parameter.valueChanged.connect(mode => {
      if (!changing) {
        select.selectedIndex = parameter.getValue();

        if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
          select.classList.add('user-edited');
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId);
          remoteUserEditedHighlightId = setTimeout(() => {
            select.classList.remove('user-edited');
            remoteUserEditedHighlightId = null;
          }, 1500);
        }
      }
    });

    const valueChange = event => {
      changing = true;
      const change = new ParameterValueChange(parameter, select.selectedIndex);
      appData.undoRedoManager.addChange(change);
      parameter.setValueDone();
      changing = false;
    };
    select.addEventListener('change', valueChange);
  }
}

uxFactory.registerWidget(
  MultiChoiceWidget,
  p => p instanceof MultiChoiceParameter
);
