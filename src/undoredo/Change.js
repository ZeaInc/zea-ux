import UndoRedoManager from './UndoRedoManager.js';

/** Class representing a change. */
export default class Change {
  /**
   * Create a change.
   * @param {any} name - The name value.
   */
  constructor(name) {
    this.name = name ? name : UndoRedoManager.getChangeClassName(this);

    this.updated = new Visualive.Signal();
  }

  /**
   * The undo method.
   */
  undo() {
    throw 'Implement me';
  }

  /**
   * The redo method.
   */
  redo() {
    throw 'Implement me';
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    throw 'Implement me';
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   */
  toJSON(appData) {
    return {};
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, appData) {}

  /**
   * The changeFromJSON method.
   * @param {any} j - The j param.
   */
  changeFromJSON(j) {
    // Many change objects can load json directly
    // in the update method.
    this.update(j);
  }

  /**
   * The destroy method.
   */
  destroy() {}
}
