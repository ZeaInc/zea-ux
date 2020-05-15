import { Signal } from '@zeainc/zea-engine'
import { UndoRedoManager } from './UndoRedoManager.js'

/**
 * Kind of an abstract class, that represents the mandatory structure of a change classes that are used in the [`UndoRedoManager`]().
 */
export default class Change {
  /**
   * Every class that extends from `Change` must contain a global `name` attribute.
   * It is used by the `UndoRedoManager` factory to re-construct the class of the specific implementation of the `Change` class.
   * @param {String} name - The name value.
   */
  constructor(name) {
    this.name = name ? name : UndoRedoManager.getChangeClassName(this)

    this.updated = new Signal()
  }

  /**
   * Called by the `UndoRedoManager` in the `undo` method, and contains the code you wanna run when the undo action is triggered, 
   * of course it depends on what you're doing.
   */
  undo() {
    throw new Error('Implement me')
  }

  /**
   * Called by the `UndoRedoManager` in the `redo` method, and is the same as the `undo` method, contains the specific code you wanna run.
   */
  redo() {
    throw new Error('Implement me')
  }

  /**
   * Use this method to udpate the state of your `Change` class.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    throw new Error('Implement me')
  }

  /**
   * The toJSON method.
   * @param {any} context - The appData param.
   * @return {Object} A JSON Object representing the state of the change.
   */
  toJSON(context) {
    return {}
  }

  /**
   * The counterpart of the `toJSON` method, this one should be called. It should contain the logic for reconstructing your class.
Setting the state or do anything you would need to perfectly replicate the change.
   * @param {Object} j - Because it is the object that we gof from `toJSON` method.
   * @param {any} context - Anything you may need to pass in order to add the change to your view.
   */
  fromJSON(j, context) {}

  /**
   * Works very similar to `fromJSON` method. But it calls the `update` method instead.
   * @param {Object} j - Because it is the object that we got from `changeUpdated` notification.
   */
  changeFromJSON(j) {
    // Many change objects can load json directly
    // in the update method.
    this.update(j)
  }

  /**
   * The destroy method.
   */
  destroy() {}
}

export { Change }
