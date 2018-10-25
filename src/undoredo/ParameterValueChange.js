import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

class ParameterValueChange extends Change {
  constructor(param, newValue) {
    if(param) {
      super(param ? (param.getName()+ ' Changed') : 'ParameterValueChange');
      this.__oldValue = param.getValue();
      this.__param = param;
      if(newValue != undefined) {
        this.__newValue = newValue;
        this.__param.setValue(this.__newValue);
      }
    }
    else {
      super();
    }
  }

  undo() {
    this.__param.setValue(this.__oldValue);
  }

  redo() {
    this.__param.setValue(this.__newValue);
  }

  update(updateData) {
    this.__newValue = updateData.value;
    this.__param.setValue(this.__newValue);
  }

  toJSON(appData) {
    const j = {
      name: this.name,
      paramPath: this.__param.getPath()
    }
    if(this.__newValue) {
      if (this.__newValue.toJSON) {
        j.value = this.__newValue.toJSON();
      } else {
        j.value = this.__newValue;
      }
    }
    return j;
  }

  fromJSON(j, appData) {
    this.__param = appData.scene.getRoot().resolvePath(j.paramPath, 1);
    this.__oldValue = this.__param.getValue();
    if (this.__oldValue.clone)
      this.__newValue = this.__oldValue.clone();
    else
      this.__newValue = this.__oldValue;

    this.name = this.__param.getName() + ' Changed';
    if(j.value != undefined)
      this.changeFromJSON(j);
  }

  changeFromJSON(j) {
    if (this.__newValue.fromJSON)
      this.__newValue.fromJSON(j.value);
    else
      this.__newValue = j.value;
    this.__param.setValue(this.__newValue);
  }
}


UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange)

export default ParameterValueChange;