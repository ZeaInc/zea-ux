import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

class FileWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', parameter.getFilepath());
    input.setAttribute('tabindex', 0);

    parentDomElem.appendChild(input);

    /////////////////////////////
    // SceneWidget Changes.

    let change = undefined;
    parameter.valueChanged.connect(() => {
      if (!change) input.value = parameter.getValue();
    });
    input.addEventListener('input', () => {
      if (!change) {
        change = new ParameterValueChange(parameter, input.valueAsNumber);
        undoRedoManager.addChange(change);
      }
      else
        change.update({ value: input.valueAsNumber });
    });
    input.addEventListener('change', () => {
      if (!change) {
        change = new ParameterValueChange(parameter);
        undoRedoManager.addChange(change);
      }
      else
        change.update({ value: input.valueAsNumber });
      change = undefined;
    });
  }
}

visualiveUxFactory.registerWidget(
  FileWidget,
  p => p.constructor.name == 'FilePathParameter'
);
