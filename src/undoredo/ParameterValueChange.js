import UndoRedoManager from './UndoRedoManager.js';
import Change from './Change.js';

/**
 * Class representing a parameter value change.
 * @extends Change
 */
class ParameterValueChange extends Change {
  /**
   * Create a parameter value change.
   * @param {any} param - The param value.
   * @param {any} newValue - The newValue value.
   */
  constructor(param, newValue) {
    if (param) {
      super(param ? param.getName() + ' Changed' : 'ParameterValueChange');
      this.__prevValue = param.getValue();
      this.__param = param;
      if (newValue != undefined) {
        this.__nextValue = newValue;
        this.__param.setValue(
          this.__nextValue,
          Visualive.ValueSetMode.USER_SETVALUE
        );
      }
    } else {
      super();
    }
  }

  /**
   * The getPrevValue method.
   * @return {any} The return value.
   */
  getPrevValue() {
    return this.__prevValue;
  }

  /**
   * The getNextValue method.
   * @return {any} The return value.
   */
  getNextValue() {
    return this.__nextValue;
  }

  /**
   * The undo method.
   */
  undo() {
    if (!this.__param) return;
    this.__param.setValue(
      this.__prevValue,
      Visualive.ValueSetMode.USER_SETVALUE
    );
  }

  /**
   * The redo method.
   */
  redo() {
    if (!this.__param) return;
    this.__param.setValue(
      this.__nextValue,
      Visualive.ValueSetMode.USER_SETVALUE
    );
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    if (!this.__param) return;
    this.__nextValue = updateData.value;
    this.__param.setValue(
      this.__nextValue,
      Visualive.ValueSetMode.USER_SETVALUE
    );
    this.updated.emit(updateData);
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(appData) {
    const j = {
      name: this.name,
      paramPath: this.__param.getPath(),
    };
    if (this.__nextValue != undefined) {
      if (this.__nextValue.toJSON) {
        j.value = this.__nextValue.toJSON();
      } else {
        j.value = this.__nextValue;
      }
    }
    return j;
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, appData) {
    const param = appData.scene.getRoot().resolvePath(j.paramPath, 1);
    if (!param || !(param instanceof Visualive.Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath);
      return;
    }
    this.__param = param;
    this.__prevValue = this.__param.getValue();
    if (this.__prevValue.clone) this.__nextValue = this.__prevValue.clone();
    else this.__nextValue = this.__prevValue;

    this.name = this.__param.getName() + ' Changed';
    if (j.value != undefined) this.changeFromJSON(j);
  }

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    if (!this.__param) return;
    if (this.__nextValue.fromJSON) this.__nextValue.fromJSON(j.value);
    else this.__nextValue = j.value;
    this.__param.setValue(
      this.__nextValue,
      Visualive.ValueSetMode.USER_SETVALUE
    );
  }
}

UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange);

export default ParameterValueChange;
