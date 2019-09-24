import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a b box widget.
 * @extends BaseWidget
 */
export default class BBoxWidget extends BaseWidget {
  /**
   * Create a b box widget.
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

    const bbox = parameter.getValue();

    // ///////////////////////////
    // Handle Changes.

    let change = undefined;

    const updateDisplayedValue = () => {
      if (!change) {
        const bbox = parameter.getValue();
        min_xField.value = bbox.p0.x;
        min_yField.value = bbox.p0.y;
        min_zField.value = bbox.p0.z;
        max_xField.value = bbox.p1.x;
        max_yField.value = bbox.p1.y;
        max_zField.value = bbox.p1.z;
      }
    };

    parameter.valueChanged.connect(updateDisplayedValue);

    const valueChange = () => {
      const bbox = new ZeaEngine.bbox();
      bbox.p0.set(
        min_xField.valueAsNumber,
        min_yField.valueAsNumber,
        min_zField.valueAsNumber
      );
      bbox.p1.set(
        max_xField.valueAsNumber,
        max_yField.valueAsNumber,
        max_zField.valueAsNumber
      );
      if (!change) {
        change = new ParameterValueChange(parameter, bbox);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value: bbox });
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
    const min_xField = addNumberField('p0.x', ul, bbox.p0.x, 0);
    const min_yField = addNumberField('p0.y', ul, bbox.p0.y, 1);
    const min_zField = addNumberField('p0.z', ul, bbox.p0.z, 2);

    const max_xField = addNumberField('p1.x', ul, bbox.p1.x, 3);
    const max_yField = addNumberField('p1.y', ul, bbox.p1.y, 4);
    const max_zField = addNumberField('p1.z', ul, bbox.p1.z, 5);
    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(
  BBoxWidget,
  p => p.getValue() instanceof ZeaEngine.Box3
);
