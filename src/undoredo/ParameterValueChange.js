import Change from './Change.js';

class ParameterValueChange extends Change {
  constructor(param, newValue) {
    super(param.getName() + ' Changed');
    this.__param = param;
    this.__newValue = newValue;
    this.__oldValue = param.getValue();
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
}

export default ParameterValueChange;
