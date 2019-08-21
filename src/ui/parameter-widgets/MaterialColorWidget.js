import BaseWidget from './BaseWidget.js';
import StringWidget from './StringWidget.js';
import FileWiget from './FileWiget.js';

import uxFactory from '../UxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

// class TexParam {
//   constructor(parameter, parentDomElem, appData) {
//     this.valueChanged = parameter.textureConnected;
//   }

//   getName() {
//     return "Name"
//   }

//   getValue() {
//     const image = this._parameter.getImage();
//   }

//   setValue(name) {
//     return this._parameter.setImage(name);
//   }
// }

/**
 * Class representing a material color widget.
 * @extends BaseWidget
 */
export default class MaterialColorWidget extends BaseWidget {
  /**
   * Create a material color widget.
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

    // this.textureWidget = new FileWiget(new TexParam(parameter), parentDomElem, appData);

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
      change = new ParameterValueChange(parameter);
      appData.undoRedoManager.addChange(change);
    });

    colorPicker.on('input:end', () => {
      change = undefined;
    });

    colorPicker.on('color:change', (color, changes) => {
      if (undoing) return;
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
  MaterialColorWidget,
  p => p instanceof Visualive.MaterialColorParam
);
