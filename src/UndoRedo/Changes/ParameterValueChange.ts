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
  param: Parameter<unknown>
  nextValue: any
  prevValue: any
  supressed: boolean = false
  /**
   * Creates an instance of ParameterValueChange.
   *
   * @param param - The Parameter object that is modified by this change.
   * @param newValue - The newValue value.
   */
  constructor(param?: Parameter<unknown>, newValue?: any) {
    super(param ? param.getName() + ' Changed' : 'ParameterValueChange')

    if (param) {
      this.prevValue = param.getValue()
      this.param = param
      if (newValue != undefined) {
        this.nextValue = newValue
        this.param.value = this.nextValue
      }
    }
  }

  /**
   * Rollbacks the value of the parameter to the previous one, passing it to the redo stack in case you wanna recover it later on.
   */
  undo(): void {
    if (this.param && !this.suppressPrimaryChange) {
      this.param.value = this.prevValue
    }
  }

  /**
   * Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack
   * and updating the parameter with the new value.
   */
  redo(): void {
    if (this.param && !this.suppressPrimaryChange) {
      this.param.value = this.nextValue
    }
  }

  /**
   * Updates the state of the current parameter change value.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<string, any>): void {
    if (!this.param) return
    this.nextValue = updateData.value

    // The supressed value is set to true by Zea Platform when the change should
    // not be applied on a local computer due to the local user  viewing a different
    // pose to the original  user who created the change.
    if (!this.supressed) {
      this.param.value = this.nextValue
    }

    this.emit('updated', updateData)
  }

  /**
   * Serializes `Parameter` instance value as a JSON object, allowing persistence/replication.
   *
   * @param context - The context param.
   * @return {object} The return value.
   */
  toJSON(context: Record<any, any>): Record<any, any> {
    const j = super.toJSON(context)
    j.paramPath = this.param.getPath()

    if (this.nextValue != undefined) {
      if (this.nextValue.toJSON) {
        j.value = this.nextValue.toJSON()
      } else {
        j.value = this.nextValue
      }
    }
    return j
  }

  /**
   * Restores `Parameter` instance's state with the specified JSON object.
   *
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): Record<any, any> {
    super.fromJSON(j, context)

    const param = context.appData.scene.getRoot().resolvePath(j.paramPath, 1)
    if (!param || !(param instanceof Parameter)) {
      console.warn('resolvePath is unable to resolve', j.paramPath)
      return
    }
    this.param = param
    this.prevValue = this.param.getValue()
    if (this.prevValue.clone) this.nextValue = this.prevValue.clone()
    else this.nextValue = this.prevValue

    if (j.value != undefined) {
      if (this.nextValue.fromJSON) this.nextValue.fromJSON(j.value)
      else this.nextValue = j.value
    }
    if (this.supressed) return
    this.param.value = this.nextValue
  }
}

// @ts-ignore
UndoRedoManager.registerChange('ParameterValueChange', ParameterValueChange)

export default ParameterValueChange
export { ParameterValueChange }
