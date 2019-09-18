import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a vec2 widget.
 * @extends BaseWidget
 */
export default class Vec2Widget extends BaseWidget {
  /**
   * Create a vec2 widget.
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

    const xField = document.createElement('input');
    // xField.className = 'mdl-textfield__input'
    xField.setAttribute('id', parameter.getName());
    xField.setAttribute('type', 'number');
    xField.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?');
    xField.setAttribute('value', parameter.getValue().x);
    xField.setAttribute('tabindex', 0);
    xField.style.width = '100%';

    const xli = document.createElement('li');
    xli.appendChild(xField);
    ul.appendChild(xli);

    const yField = document.createElement('input');
    // yField.className = 'mdl-textfield__input'
    yField.setAttribute('id', parameter.getName());
    yField.setAttribute('type', 'number');
    yField.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?');
    yField.setAttribute('value', parameter.getValue().y);
    yField.setAttribute('tabindex', 0);
    yField.style.width = '100%';

    const yli = document.createElement('li');
    yli.appendChild(yField);
    ul.appendChild(yli);

    parentDomElem.appendChild(container);

    // ///////////////////////////
    // SceneWidget Changes.

    let change = undefined;
    parameter.valueChanged.connect(() => {
      if (!change) {
        const vec2 = parameter.getValue();
        xField.value = vec2.x;
        yField.value = vec2.y;
      }
    });
    const valueChange = () => {
      const value = new ZeaEngine.Vec2(
        xField.valueAsNumber,
        yField.valueAsNumber
      );
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
    xField.addEventListener('input', valueChange);
    yField.addEventListener('input', valueChange);
    xField.addEventListener('change', valueChangeEnd);
    yField.addEventListener('change', valueChangeEnd);
  }
}

uxFactory.registerWidget(Vec2Widget, p => p instanceof ZeaEngine.Vec2Parameter);
