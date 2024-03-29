import { EventEmitter } from '@zeainc/zea-engine'
import { UndoRedoManager } from './UndoRedoManager.js'

/**
 * Kind of an abstract class, that represents the mandatory structure of a change classes that are used in the [`UndoRedoManager`]().
 *
 * @note If you don't extend this class, ensure to implement all methods specified in here.
 * @extends {EventEmitter}
 */
class Change extends EventEmitter {
  name: string
  secondaryChanges: Change[] = []
  suppressPrimaryChange: boolean = false
  closed: boolean = false
  /**
   * Every class that extends from `Change` must contain a global `name` attribute.
   * It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.
   *
   * @param name - The name value.
   */
  constructor(name?: string) {
    super()
    this.name = name ? name : UndoRedoManager.getChangeClassName(this)
  }

  addSecondaryChange(secondaryChange: Change) {
    const index = this.secondaryChanges.length
    this.secondaryChanges.push(secondaryChange)
    secondaryChange.setPrimaryChange(this)
    return index
  }

  setPrimaryChange(primaryChange: Change) {}

  /**
   * Called by the `UndoRedoManager` in the `undo` method, and contains the code you wanna run when the undo action is triggered,
   * of course it depends on what you're doing.
   *
   * @note This method needs to be implemented, otherwise it will throw an Error.
   */
  undo(): void {}

  /**
   * Called by the `UndoRedoManager` in the `redo` method, and is the same as the `undo` method, contains the specific code you wanna run.
   *
   * @note This method needs to be implemented, otherwise it will throw an Error.
   */
  redo(): void {}

  /**
   * Use this method to update the state of your `Change` class.
   *
   * @note This method needs to be implemented, otherwise it will throw an Error.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    throw new Error('Implement me')
  }

  /**
   * Serializes the `Change` instance as a JSON object, allowing persistence/replication
   *
   * @note This method needs to be implemented, otherwise it will return an empty object.
   *
   * @param context - The appData param.
   */
  toJSON(context: Record<any, any>): Record<any, any> {
    return {
      name: this.name,
      className: this.getClassName(),
      secondaryChanges: this.secondaryChanges.map((change) => change.toJSON(context)),
    }
  }

  /**
   * The counterpart of the `toJSON` method, restoring `Change` instance's state with the specified JSON object.
   * Each `Change` class must implement the logic for reconstructing itself.
   * Very often used to restore from persisted/replicated JSON.
   *
   * @note This method needs to be implemented, otherwise it will do nothing.
   *
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    this.name = j.name

    j.secondaryChanges.forEach((childJson: Record<any, any>) => {
      const change = UndoRedoManager.getInstance().constructChange(childJson.className)
      change.fromJSON(childJson, context)
      this.addSecondaryChange(change)
    })
  }

  /**
   * Method destined to clean up things that would need to be cleaned manually.
   * It is executed when flushing the undo/redo stacks or adding a new change to the undo stack,
   * so it is require in any class that represents a change.
   *
   */
  destroy(): void {}
}

UndoRedoManager.registerChange('Change', Change)

export default Change
export { Change }
