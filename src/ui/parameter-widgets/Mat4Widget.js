import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing an Mat4 widget.
 * @extends BaseWidget
 */
export default class Mat4Widget extends BaseWidget {
  /**
   * Create an Mat4 widget.
   * @param {Mat4Parameter} parameter - The parameter value.
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

    const updateDisplayedValue = mode => {
      if (!settingValue) {

        // https://www.jacklmoore.com/notes/rounding-in-javascript/
        function round(value, decimals=6) {
          return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
        const mat4 = parameter.getValue();
        m00Field.value = round(mat4.m00);
        m01Field.value = round(mat4.m01);
        m02Field.value = round(mat4.m02);
        m03Field.value = round(mat4.m03);

        m10Field.value = round(mat4.m10);
        m11Field.value = round(mat4.m11);
        m12Field.value = round(mat4.m12);
        m13Field.value = round(mat4.m13);

        m20Field.value = round(mat4.m20);
        m21Field.value = round(mat4.m21);
        m22Field.value = round(mat4.m22);
        m23Field.value = round(mat4.m23);

        m30Field.value = round(mat4.m30);
        m31Field.value = round(mat4.m31);
        m32Field.value = round(mat4.m32);
        m33Field.value = round(mat4.m33);
        
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
      const mat4 = new ZeaEngine.Mat4();
      mat4.set(
        m00Field.valueAsNumber,
        m01Field.valueAsNumber,
        m02Field.valueAsNumber,
        m03Field.valueAsNumber,

        m10Field.valueAsNumber,
        m11Field.valueAsNumber,
        m12Field.valueAsNumber,
        m13Field.valueAsNumber,

        m20Field.valueAsNumber,
        m21Field.valueAsNumber,
        m22Field.valueAsNumber,
        m23Field.valueAsNumber,

        m30Field.valueAsNumber,
        m31Field.valueAsNumber,
        m32Field.valueAsNumber,
        m33Field.valueAsNumber
      );
      if (!change) {
        change = new ParameterValueChange(parameter, xfo);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value: mat4 });
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

    const mat4 = parameter.getValue();
    // Row 0
    const m00Field = addNumberField('m00', ul, mat4.m00, 0);
    const m01Field = addNumberField('m01', ul, mat4.m01, 1);
    const m02Field = addNumberField('m02', ul, mat4.m02, 2);
    const m03Field = addNumberField('m03', ul, mat4.m03, 3);
    
    // Row 1
    const m10Field = addNumberField('m10', ul, mat4.m10, 4);
    const m11Field = addNumberField('m11', ul, mat4.m11, 5);
    const m12Field = addNumberField('m12', ul, mat4.m12, 6);
    const m13Field = addNumberField('m13', ul, mat4.m13, 7);
    
    // Row 2
    const m20Field = addNumberField('m20', ul, mat4.m20, 8);
    const m21Field = addNumberField('m21', ul, mat4.m21, 9);
    const m22Field = addNumberField('m22', ul, mat4.m22, 10);
    const m23Field = addNumberField('m23', ul, mat4.m23, 11);
    
    // Row 3
    const m30Field = addNumberField('m30', ul, mat4.m30, 12);
    const m31Field = addNumberField('m31', ul, mat4.m31, 13);
    const m32Field = addNumberField('m32', ul, mat4.m32, 14);
    const m33Field = addNumberField('m33', ul, mat4.m33, 15);

    parentDomElem.appendChild(container);
  }
}

uxFactory.registerWidget(Mat4Widget, p => p instanceof ZeaEngine.Mat4Parameter);
