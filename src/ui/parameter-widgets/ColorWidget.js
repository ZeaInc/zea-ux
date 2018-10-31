// import * as Visualive from '@visualive/engine';

import iro from '@jaames/iro';
// import iro from '../../../node_modules/@jaames/iro/dist/iro.es.js';
// import iro from 'https://rawgit.com/jaames/iro.js/master/dist/iro.es.js';

import BaseWidget from './BaseWidget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

export default class ColorWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    console.log('ColorWidget');
    super(parameter);

    const colorPicker = new iro.ColorPicker(parentDomElem, {
      // Color picker options:
      // https://rakujira.jp/projects/iro/docs/guide.html#Color-Picker-Options
      width: 200,
      height: 200,
      color: { r: 255, g: 0, b: 0 },
      anticlockwise: true,
      borderWidth: 1,
      borderColor: '#fff',
    });

    /////////////////////////////
    // Handle Changes.

    let change = undefined;

    parameter.valueChanged.connect(() => {
      if (!change) {
        const col = parameter.getValue();
        colorPicker.color.rgb = {
          r: col.r * 255,
          g: col.g * 255,
          b: col.b * 255,
        };
      }
    });

    colorPicker.on('input:start', () => {
      change = new ParameterValueChange(parameter);
      undoRedoManager.addChange(change);
    });

    colorPicker.on('input:end', () => {
      change = undefined;
    });

    colorPicker.on('color:change', (color, changes) => {
      const rgb = colorPicker.color.rgb;
      const value = new Visualive.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);
      if (!change) {
        change = new ParameterValueChange(parameter, value);
        undoRedoManager.addChange(change);
      } else {
        change.update({ value });
      }
    });
  }

  setParentDomElem(parentDomElem) {}
}

visualiveUxFactory.registerWidget(
  ColorWidget,
  p => p.constructor.name == 'ColorParameter'
);
