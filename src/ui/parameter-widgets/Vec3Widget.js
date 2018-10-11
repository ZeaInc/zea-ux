import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class Vec3Widget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
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

    const zField = document.createElement('input');
    // zField.className = 'mdl-textfield__input'
    zField.setAttribute('id', parameter.getName());
    zField.setAttribute('type', 'number');
    zField.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?');
    zField.setAttribute('value', parameter.getValue().z);
    zField.setAttribute('tabindex', 0);
    zField.style.width = '100%';

    const zli = document.createElement('li');
    zli.appendChild(zField);
    ul.appendChild(zli);

    parentDomElem.appendChild(container);

    /////////////////////////////
    // Handle Changes.

    let change = undefined;

    parameter.valueChanged.connect(() => {
      if (!change) {
        const vec3 = parameter.getValue();
        xField.value = vec3.x;
        yField.value = vec3.y;
        zField.value = vec3.z;
      }
    });

    const valueChange = () => {
      if (!change) {
        change = new ParameterValueChange(parameter);
        undoRedoManager.addChange(change);
      }
      change.setValue(
        new Visualive.Vec3(
          xField.valueAsNumber,
          yField.valueAsNumber,
          zField.valueAsNumber
        )
      );
    };

    const valueChangeEnd = () => {
      valueChange();
      change = undefined;
    };

    xField.addEventListener('input', valueChange);
    yField.addEventListener('input', valueChange);
    zField.addEventListener('input', valueChange);

    xField.addEventListener('change', valueChangeEnd);
    yField.addEventListener('change', valueChangeEnd);
    zField.addEventListener('change', valueChangeEnd);
  }
}

visualiveUxFactory.registerWidget(
  Vec3Widget,
  p => p.constructor.name == 'Vec3Parameter'
);
