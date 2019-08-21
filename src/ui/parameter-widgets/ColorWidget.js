// import iro from '@jaames/iro';
// import iro from '../../../node_modules/@jaames/iro/dist/iro.es.js';
// import iro from 'https://rawgit.com/jaames/iro.js/master/dist/iro.es.js';

import BaseWidget from './BaseWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

/**
 * Class representing a color widget.
 * @extends BaseWidget
 */
export default class ColorWidget extends BaseWidget {
  /**
   * Create a color widget.
   * @param {any} parameter - The parameter value.
   * @param {any} parentDomElem - The parentDomElem value.
   * @param {any} appData - The appData value.
   */
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const colorPicker = new iro.ColorPicker(parentDomElem, {
      // Color picker options:
      // https://rakujira.jp/projects/iro/docs/guide.html#Color-Picker-Options
      width: 200,
      height: 200,
      color: parameter.getValue().getAsRGBDict(),
      anticlockwise: true,
      borderWidth: 1,
      borderColor: '#fff',
    });

    // ///////////////////////////
    // SceneWidget Changes.

    let change = undefined;
    let undoing = false;

    parameter.valueChanged.connect(() => {
      if (!change) {
        undoing = true;
        colorPicker.color.rgb = parameter.getValue().getAsRGBDict();
        undoing = false;
      }
    });

    colorPicker.on('input:start', () => {
      console.log('input:start', parameter.getValue().getAsRGBDict());
      change = new ParameterValueChange(parameter);
      appData.undoRedoManager.addChange(change);
    });

    colorPicker.on('input:end', () => {
      console.log('input:end');
      change = undefined;
    });

    colorPicker.on('color:change', (color, changes) => {
      if (undoing) return;
      // console.log('input:change', colorPicker.color.rgb, !change)
      const value = new Visualive.Color();
      value.setFromRGBDict(colorPicker.color.rgb);
      if (!change) {
        change = new ParameterValueChange(parameter, value);
        appData.undoRedoManager.addChange(change);
      } else {
        change.update({ value });
      }
    });
  }

  /**
   * The setParentDomElem method.
   * @param {any} parentDomElem - The parentDomElem param.
   */
  setParentDomElem(parentDomElem) {}
}

uxFactory.registerWidget(
  ColorWidget,
  p => p instanceof Visualive.ColorParameter
);
