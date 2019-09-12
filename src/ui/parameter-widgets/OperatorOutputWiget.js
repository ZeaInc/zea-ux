import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';

/**
 * Class representing an item set widget.
 * @extends BaseWidget
 */
export default class OperatorOutputWidget extends BaseWidget {
  /**
   * Create an item set widget.
   * @param {any} opOutput - The opOutput value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(opOutput, parentDomElem, appData) {
    super(opOutput);

    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', opOutput.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', opOutput.getValue());
    input.setAttribute('tabindex', 0);
    
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('Pick'));
    button.addEventListener('click', e => {
      appData.selectionManager.startPickingMode(
        `Pick ${opOutput.getName()} item.`,
        items => {
          // const change = new ParameterValueChange(opOutput, items[0]);
          // appData.undoRedoManager.addChange(change);
          // TODO: Display a dialo
          opOutput.setParam(items.getParameter('GlobalXfo'))
        },
        opOutput.getFilterFn(),
        1
      );
    });
    button.style.margin = '2px';

    parentDomElem.appendChild(input);
    parentDomElem.appendChild(button);

  }
}

uxFactory.registerWidget(
  OperatorOutputWidget,
  p => p instanceof ZeaEngine.OperatorOutput
);
