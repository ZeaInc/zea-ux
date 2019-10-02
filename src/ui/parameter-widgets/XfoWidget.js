import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing an xfo widget.
 * @extends BaseWidget
 */
export default class XfoWidget extends BaseWidget {
  /**
   * Create an xfo widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const container = document.createElement('div');
    container.className = 'container';

    const ul = document.createElement('ul');
    ul.className = 'flex-editvalues';
    container.appendChild(ul);

    const xfo = parameter.getValue();

    // ///////////////////////////
    // Handle Changes.

    let change = undefined;
    // TODO: All parameter widgets should guard using an explicit boolean.
    // This is because the 'change' variable is only assigned after the
    // ParameterValueChange returns, however, the ParameterValueChange
    // also sets the value of the parameter which causesa value changed 
    // notification.
    let settingValue = false;

    const updateDisplayedValue = () => {
      if (!settingValue) {

        // https://www.jacklmoore.com/notes/rounding-in-javascript/
        function round(value, decimals=6) {
          return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
        const xfo = parameter.getValue();
        tr_xField.value = round(xfo.tr.x);
        tr_yField.value = round(xfo.tr.y);
        tr_zField.value = round(xfo.tr.z);
        ori_xField.value = round(xfo.ori.x);
        ori_yField.value = round(xfo.ori.y);
        ori_zField.value = round(xfo.ori.z);
        ori_wField.value = round(xfo.ori.w);
        sc_xField.value = round(xfo.sc.x);
        sc_yField.value = round(xfo.sc.y);
        sc_zField.value = round(xfo.sc.z);
      }
    };

    parameter.valueChanged.connect(updateDisplayedValue);

    const valueChange = () => {
      settingValue = true;
      const xfo = new ZeaEngine.Xfo();
      xfo.tr.set(
        tr_xField.valueAsNumber,
        tr_yField.valueAsNumber,
        tr_zField.valueAsNumber
      );
      xfo.ori.set(
        ori_xField.valueAsNumber,
        ori_yField.valueAsNumber,
        ori_zField.valueAsNumber,
        ori_wField.valueAsNumber
      ); /* value order is xyzw*/
      xfo.ori.normalizeInPlace();
      xfo.sc.set(
        sc_xField.valueAsNumber,
        sc_yField.valueAsNumber,
        sc_zField.valueAsNumber
      );
      if (!change) {
        change = new ParameterValueChange(parameter, xfo);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value: xfo });
      }
    };

    const valueChangeEnd = () => {
      valueChange();
      change = undefined;
      settingValue = false;
      updateDisplayedValue();
    };

    function addNumberField(name, ul, value, tabindex) {
      const li = document.createElement('li');

      // const labelElem = document.createElement('label');
      // labelElem.setAttribute('for', name);
      // labelElem.appendChild(document.createTextNode(name));
      // li.appendChild(labelElem);

      const input = document.createElement('input');
      // input.className = 'mdl-textfield__input'
      input.setAttribute('id', parameter.getName());
      input.setAttribute('type', 'number');
      input.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?');
      input.setAttribute('value', value);
      input.setAttribute('tabindex', tabindex);
      input.style.width = '100%';

      li.appendChild(input);
      ul.appendChild(li);

      input.addEventListener('input', valueChange);
      input.addEventListener('change', valueChangeEnd);

      return input;
    }
    const tr_xField = addNumberField('tr.x', ul, xfo.tr.x, 0);
    const tr_yField = addNumberField('tr.y', ul, xfo.tr.y, 1);
    const tr_zField = addNumberField('tr.z', ul, xfo.tr.z, 2);

    const ori_xField = addNumberField('ori.x', ul, xfo.ori.x, 3);
    const ori_yField = addNumberField('ori.y', ul, xfo.ori.y, 4);
    const ori_zField = addNumberField('ori.z', ul, xfo.ori.z, 5);
    const ori_wField = addNumberField('ori.w', ul, xfo.ori.w, 6);

    const sc_xField = addNumberField('sc.x', ul, xfo.sc.x, 7);
    const sc_yField = addNumberField('sc.y', ul, xfo.sc.y, 8);
    const sc_zField = addNumberField('sc.z', ul, xfo.sc.z, 9);
    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(XfoWidget, p => p instanceof ZeaEngine.XfoParameter);
