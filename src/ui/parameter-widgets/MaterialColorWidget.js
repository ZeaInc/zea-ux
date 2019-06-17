

import BaseWidget from './BaseWidget.js';
import StringWidget from './StringWidget.js';
import FileWiget from './FileWiget.js';

import visualiveUxFactory from '../VisualiveUxFactory.js';
import ParameterValueChange from '../../undoredo/ParameterValueChange.js';

// class TexParam {
//   constructor(parameter, parentDomElem, undoRedoManager) {
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

export default class MaterialColorWidget extends BaseWidget {
  constructor(parameter, parentDomElem, undoRedoManager) {
    console.log('MaterialColorWidget');
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

    // this.textureWidget = new FileWiget(new TexParam(parameter), parentDomElem, undoRedoManager);

    /////////////////////////////
    // SceneWidget Changes.

    let change = undefined;
    let undoing = false;

    parameter.valueChanged.connect(() => {
      if (!change) {
        undoing = true;
        colorPicker.color.rgb = parameter.getValue().getAsRGBDict()
        undoing = false;
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
      if(undoing)
        return;
      const value = new Visualive.Color();
      value.setFromRGBDict(colorPicker.color.rgb);
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
  MaterialColorWidget,
  p => p.constructor.name == 'MaterialColorParam'
);
