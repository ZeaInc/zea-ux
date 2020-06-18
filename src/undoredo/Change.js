import { EventEmitter } from '@zeainc/zea-engine'
import { UndoRedoManager } from './UndoRedoManager.js'

/** Class representing a change. */
export default class Change extends EventEmitter {
  /**
   * Create a change.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super()
    this.name = name ? name : UndoRedoManager.getChangeClassName(this)
  }

  /**
   * The undo method.
   */
  undo() {
    throw new Error('Implement me')
  }

  /**
   * The redo method.
   */
  redo() {
    throw new Error('Implement me')
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    throw new Error('Implement me')
  }

  /**
   * The toJSON method.
   * @param {any} context - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    return {}
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} context - The context param.
   */
  fromJSON(j, context) {}

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
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
