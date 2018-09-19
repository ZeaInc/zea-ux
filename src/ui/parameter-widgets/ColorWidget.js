import iro from '@jaames/iro';

import BaseWidget from './BaseWidget';

import parameterWidgetFactory from '../ParameterWidgetFactory';
import undoRedoManager from '../../undoredo/UndoRedoManager';
import ParameterValueChange from '../../undoredo/ParameterValueChange';

class ColorWidget extends BaseWidget {
  constructor(parameter, parentDomElem) {
    super(parameter);

    const colorPicker = new iro.ColorPicker(parentDomElem, {
      // Color picker options:
      // https://rakujira.jp/projects/iro/docs/guide.html#Color-Picker-Options
      width: 200,
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
      if (!change) {
        change = new ParameterValueChange(parameter);
        undoRedoManager.addChange(change);
      }
      const rgb = colorPicker.color.rgb;
      change.setValue(
        new Visualive.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255)
      );
    });
  }

  setParentDomElem(parentDomElem) {}
}

parameterWidgetFactory.registerWidget(
  ColorWidget,
  p => p.constructor.name == 'ColorParameter'
);
