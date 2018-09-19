import Change from './Change';

class ParameterValueChange extends Change {
  constructor(param) {
    super(param.getName() + ' Changed');
    this.__param = param;
    this.__newValue;
    this.__oldValue = param.getValue();
  }

  setValue(value) {
    this.__param.setValue(value);
    this.__newValue = value;
  }

  undo() {
    this.__param.setValue(this.__oldValue);
  }

  redo() {
    this.__param.setValue(this.__newValue);
  }
}

export default ParameterValueChange;
