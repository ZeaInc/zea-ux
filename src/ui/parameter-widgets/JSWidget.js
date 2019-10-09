import BaseWidget from './BaseWidget.js';

import ParameterValueChange from '../../undoredo/ParameterValueChange.js';
import uxFactory from '../UxFactory.js';

const JSCODE = 1 << 8;

/**
 * Class representing a string widget.
 * @extends BaseWidget
 */
export default class JSWidget extends BaseWidget {
  /**
   * Create a string widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const div = document.createElement('div');
    div.setAttribute('id', parameter.getName());
    div.textContent = parameter.getValue();
    div.style.width = '100%';
    const numLines = Math.min(50, parameter.getValue().split('\n').length);
    div.style.height = (numLines < 5 ? 100 : (numLines * 14)) + 'px';
    parentDomElem.appendChild(div);

    const editor = ace.edit(div);
    editor.setTheme('ace/theme/chrome');
    editor.session.setMode('ace/mode/javascript');

    // ///////////////////////////
    // Handle Changes.

    let change;
    parameter.valueChanged.connect(() => {
      if (!change) {
        editor.session.setValue(parameter.getValue());
      }
    });

    const valueChange = () => {
      const value = editor.getValue();
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
    // editor.session.on('change', function(delta) {
    //   // delta.start, delta.end, delta.lines, delta.action
    //   console.log(delta);
    //   // valueChange();
    // });
    div.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key == 's') {
        valueChange();
        event.stopPropagation();
        event.preventDefault();
      }
    });
  }
}

uxFactory.registerWidget(
  JSWidget,
  p => p instanceof ZeaEngine.StringParameter && p.testFlag(JSCODE)
);
