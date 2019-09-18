import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a file widget.
 * @extends BaseWidget
 */
class FileWidget extends BaseWidget {
  /**
   * Create a file widget.
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
    input.setAttribute('value', parameter.getFilepath());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    // ///////////////////////////
    // SceneWidget Changes.

    let change = undefined;
    parameter.valueChanged.connect(() => {
      if (!change) input.value = parameter.getValue();
    });
    input.addEventListener('input', () => {
      if (!change) {
        change = new ParameterValueChange(parameter, input.valueAsNumber);
        appData.undoRedoManager.addChange(change);
      } else change.update({ value: input.valueAsNumber });
    });
    input.addEventListener('change', () => {
      if (!change) {
        change = new ParameterValueChange(parameter);
        appData.undoRedoManager.addChange(change);
      } else change.update({ value: input.valueAsNumber });
      change = undefined;
    });
  }
}

uxFactory.registerWidget(
  FileWidget,
  p => p instanceof ZeaEngine.FilePathParameter
);
