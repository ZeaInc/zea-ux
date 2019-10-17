import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing an Mat3 widget.
 * @extends BaseWidget
 */
export default class Mat3Widget extends BaseWidget {
  /**
   * Create an Mat3 widget.
   * @param {Mat3Parameter} parameter - The parameter value.
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


    // ///////////////////////////
    // Handle Changes.

    let change = undefined;
    let remoteUserEditedHighlightId;
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
        const mat3 = parameter.getValue();
        m00Field.value = round(mat3.m00);
        m01Field.value = round(mat3.m01);
        m02Field.value = round(mat3.m02);

        m10Field.value = round(mat3.m10);
        m11Field.value = round(mat3.m11);
        m12Field.value = round(mat3.m12);

        m20Field.value = round(mat3.m20);
        m21Field.value = round(mat3.m21);
        m22Field.value = round(mat3.m22);
        
        if (mode == ZeaEngine.ValueSetMode.REMOTEUSER_SETVALUE) {
          container.classList.add('user-edited');
          if (remoteUserEditedHighlightId)
            clearTimeout(remoteUserEditedHighlightId);
          remoteUserEditedHighlightId = setTimeout(() => {
            container.classList.remove('user-edited');
            remoteUserEditedHighlightId = null
          }, 1500);
        }
      }
    };

    parameter.valueChanged.connect(updateDisplayedValue);

    const valueChange = () => {
      settingValue = true;
      const mat3 = new ZeaEngine.Mat3();
      mat3.set(
        m00Field.valueAsNumber,
        m01Field.valueAsNumber,
        m02Field.valueAsNumber,

        m10Field.valueAsNumber,
        m11Field.valueAsNumber,
        m12Field.valueAsNumber,

        m20Field.valueAsNumber,
        m21Field.valueAsNumber,
        m22Field.valueAsNumber
      );
      if (!change) {
        change = new ParameterValueChange(parameter, xfo);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value: mat3 });
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

    const mat3 = parameter.getValue();
    // Row 0
    const m00Field = addNumberField('m00', ul, mat3.m00, 0);
    const m01Field = addNumberField('m01', ul, mat3.m01, 1);
    const m02Field = addNumberField('m02', ul, mat3.m02, 2);
    
    // Row 1
    const m10Field = addNumberField('m10', ul, mat3.m10, 3);
    const m11Field = addNumberField('m11', ul, mat3.m11, 4);
    const m12Field = addNumberField('m12', ul, mat3.m12, 5);
    
    // Row 2
    const m20Field = addNumberField('m20', ul, mat3.m20, 6);
    const m21Field = addNumberField('m21', ul, mat3.m21, 7);
    const m22Field = addNumberField('m22', ul, mat3.m22, 8);

    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(Mat3Widget, p => p instanceof ZeaEngine.Mat3Parameter);
