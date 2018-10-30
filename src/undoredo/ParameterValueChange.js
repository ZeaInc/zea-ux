import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

class ParameterValueChange extends Change {
  constructor(param, newValue) {
    if(param) {
      super(param ? (param.getName()+ ' Changed') : 'ParameterValueChange');
      this.__prevValue = param.getValue();
      this.__param = param;
      if(newValue != undefined) {
        this.__nextValue = newValue;
        this.__param.setValue(this.__nextValue);
      }
    }
    else {
      super();
    }
  }

  getPrevValue() {
    return this.__prevValue;
  }
  getNextValue() {
    return this.__nextValue;
  }


  undo() {
    this.__param.setValue(this.__prevValue);
  }

  redo() {
    this.__param.setValue(this.__nextValue);
  }

  update(updateData) {
    this.__nextValue = updateData.value;
    this.__param.setValue(this.__nextValue);
  }

  toJSON(appData) {
    const j = {
      name: this.name,
      paramPath: this.__param.getPath()
    }
    if(this.__nextValue) {
      if (this.__nextValue.toJSON) {
        j.value = this.__nextValue.toJSON();
      } else {
        j.value = this.__nextValue;
      }
    }
    return j;
  }

  fromJSON(j, appData) {
    this.__param = appData.scene.getRoot().resolvePath(j.paramPath, 1);
    this.__prevValue = this.__param.getValue();
    if (this.__prevValue.clone)
      this.__nextValue = this.__prevValue.clone();
    else
      this.__nextValue = this.__prevValue;

    this.name = this.__param.getName() + ' Changed';
    if(j.value != undefined)
      this.changeFromJSON(j);
  }

  changeFromJSON(j) {
    if (this.__nextValue.fromJSON)
      this.__nextValue.fromJSON(j.value);
    else
      this.__nextValue = j.value;
    this.__param.setValue(this.__nextValue);
  }
}


UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange)

export default ParameterValueChange;