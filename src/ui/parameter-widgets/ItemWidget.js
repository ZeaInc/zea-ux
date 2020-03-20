import { TreeItemParameter } from '@zeainc/zea-engine';
import BaseWidget from './BaseWidget.js';
import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing an item widget.
 * @extends BaseWidget
 */
export default class ItemWidget extends BaseWidget {
  /**
   * Create an item widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const value = parameter.getValue();
    const input = document.createElement('input');
    input.className = 'mdl-textfield__input';
    input.setAttribute('id', parameter.getName());
    input.setAttribute('type', 'text');
    input.setAttribute('value', value ? value.getPath().join('/') : '<none>');
    input.style['outline-color'] = 'grey';
    input.style['outline-width'] = '1px';
    input.style['outline-style'] = 'solid';

    const button = document.createElement('button');
    button.appendChild(document.createTextNode('Pick'));
    button.addEventListener('click', e => {
      appData.selectionManager.startPickingMode(
        `Pick ${parameter.getName()} item.`,
        items => {
          const change = new ParameterValueChange(parameter, items[0]);
          appData.undoRedoManager.addChange(change);
        },
        parameter.getFilterFn(),
        1
      );
    });
    button.style.margin = '2px';

    parentDomElem.appendChild(input);
    parentDomElem.appendChild(button);

    // ///////////////////////////
    // Handle Changes.

    const changing = false;

    parameter.valueChanged.connect(() => {
      if (!changing) {
        const value = parameter.getValue();
        input.setAttribute(
          'value',
          value ? value.getPath().join('/') : '<none>'
        );
      }
    });
  }
}

uxFactory.registerWidget(ItemWidget, p => p instanceof TreeItemParameter);
