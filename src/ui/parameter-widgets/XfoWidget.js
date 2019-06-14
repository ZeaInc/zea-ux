// import * as Visualive from '@visualive/engine';

import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class XfoWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    super(parameter);

    const container = document.createElement('div');
    container.className = 'container';

    const ul = document.createElement('ul');
    ul.className = 'flex-editvalues';
    container.appendChild(ul);

    const xfo = parameter.getValue();

    /////////////////////////////
    // SceneWidget Changes.

    let change = undefined;

    const updateDisplayedValue = () => {
      if (!change) {
        const xfo = parameter.getValue();
        tr_xField.value = xfo.tr.x;
        tr_yField.value = xfo.tr.y;
        tr_zField.value = xfo.tr.z;
        ori_wField.value = xfo.ori.w;
        ori_xField.value = xfo.ori.x;
        ori_yField.value = xfo.ori.y;
        ori_zField.value = xfo.ori.z;
        sc_xField.value = xfo.sc.x;
        sc_yField.value = xfo.sc.y;
        sc_zField.value = xfo.sc.z;
      }
    }

    parameter.valueChanged.connect(updateDisplayedValue);

    const valueChange = () => {
      const xfo = new Visualive.Xfo();
      xfo.tr.set(
        tr_xField.valueAsNumber,
        tr_yField.valueAsNumber,
        tr_zField.valueAsNumber
      )
      xfo.ori.set(
        ori_wField.valueAsNumber,
        ori_xField.valueAsNumber,
        ori_yField.valueAsNumber,
        ori_zField.valueAsNumber
      )
      xfo.ori.normalizeInPlace()
      xfo.sc.set(
        sc_xField.valueAsNumber,
        sc_yField.valueAsNumber,
        sc_zField.valueAsNumber
      )
      if (!change) {
        change = new ParameterValueChange(parameter, xfo);
        undoRedoManager.addChange(change);
      }
      else {
        change.update({ value:xfo });
      }
      updateDisplayedValue();
    };

    const valueChangeEnd = () => {
      valueChange();
      change = undefined;
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
    const tr_xField = addNumberField("tr.x", ul, xfo.tr.x, 0)
    const tr_yField = addNumberField("tr.y", ul, xfo.tr.y, 1)
    const tr_zField = addNumberField("tr.z", ul, xfo.tr.z, 2)

    const ori_wField = addNumberField("ori.w", ul, xfo.ori.w, 3)
    const ori_xField = addNumberField("ori.x", ul, xfo.ori.x, 4)
    const ori_yField = addNumberField("ori.y", ul, xfo.ori.y, 5)
    const ori_zField = addNumberField("ori.z", ul, xfo.ori.z, 6)

    const sc_xField = addNumberField("sc.x", ul, xfo.sc.x, 7)
    const sc_yField = addNumberField("sc.y", ul, xfo.sc.y, 8)
    const sc_zField = addNumberField("sc.z", ul, xfo.sc.z, 9)
    parentDomElem.appendChild(container);
  }
}

visualiveUxFactory.registerWidget(
  XfoWidget,
  p => p.constructor.name == 'XfoParameter'
);
