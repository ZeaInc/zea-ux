import { Parameter } from '@zeainc/zea-engine'
import UndoRedoManager from '../UndoRedoManager'
import Change from '../Change'

/**
 * Represents a `Change` class for storing `Parameter` values.
 *
 * **Events**
 * * **updated:** Triggered when the `ParameterValueChange` value is updated.
 *
 * @extends Change
 */
class ParameterValueChange extends Change {
  __param: Parameter<unknown>
  __nextValue
  __prevValue
  suppressPrimaryChange
  secondaryChanges
  /**
   * Creates an instance of ParameterValueChange.
   *
   * @param {Parameter} param - The param value.
   * @param {object|string|number|any} newValue - The newValue value.
   */
  constructor(param?, newValue?) {
    if (param) {
      super(param ? param.getName() + ' Changed' : 'ParameterValueChange')
      this.__prevValue = param.getValue()
      this.__param = param
      if (newValue != undefined) {
        this.__nextValue = newValue
        this.__param.setValue(this.__nextValue)
      }
    } else {
      super()
    }

    this.suppressPrimaryChange = false
    this.secondaryChanges = []
  }

  /**
   * Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.
   */
  undo() {
    if (!this.__param) return

    if (!this.suppressPrimaryChange) this.__param.setValue(this.__prevValue)

    this.secondaryChanges.forEach((change) => change.undo())
  }

  /**
   * Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack
   * and updating the parameter with the new value.
   */
  redo() {
    if (!this.__param) return
    if (!this.suppressPrimaryChange) this.__param.setValue(this.__nextValue)

    this.secondaryChanges.forEach((change) => change.redo())
  }

  /**
   * Updates the state of the current parameter change value.
   *
   * @param {Parameter} updateData - The updateData param.
   */
  update(updateData: Record<string, any>) {
    if (!this.__param) return
    this.__nextValue = updateData.value
    this.__param.setValue(this.__nextValue)
    this.emit('updated', updateData)
  }

  /**
   * Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.
   *
   * @param {object} context - The context param.
   * @return {object} The return value.
   */
  toJSON(context: Record<any, any>): Record<any, any> {
    const j: Record<any, any> = {
      name: this.name,
      paramPath: this.__param.getPath(),
    }

    if (this.__nextValue != undefined) {
      if (this.__nextValue.toJSON) {
        j.value = this.__nextValue.toJSON()
      } else {
        j.value = this.__nextValue
      }
    }
    return j
  }

  /**
   * Restores `Parameter` instance's state with the specified JSON object.
   *
   * @param {Record<any, any>} j - The j param.
   * @param {Record<any, any>} context - The context param.
   */
  fromJSON(j, context: Record<any, any>): Record<any, any> {
    const param = context.appData.scene.getRoot().resolvePath(j.paramPath, 1)
    if (!param || !(param instanceof Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath)
      return
    }
    this.__param = param
    this.__prevValue = this.__param.getValue()
    if (this.__prevValue.clone) this.__nextValue = this.__prevValue.clone()
    else this.__nextValue = this.__prevValue

    this.name = j.name
    if (j.value != undefined) this.updateFromJSON(j)
  }

  /**
   * Updates the state of an existing identified `Parameter` through replication.
   *
   * @param {Record<any, any>} j - The j param.
   */
  updateFromJSON(j: Record<any, any>): void {
    if (!this.__param) return
    if (this.__nextValue.fromJSON) this.__nextValue.fromJSON(j.value)
    else this.__nextValue = j.value
    this.__param.setValue(this.__nextValue)
  }
}

UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange)

export default ParameterValueChange
export { ParameterValueChange }
