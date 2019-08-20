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

  undo() {
    throw 'Implement me';
  }

  redo() {
    throw 'Implement me';
  }

  update(updateData) {
    throw 'Implement me';
  }

  toJSON(appData) {
    return {};
  }

  fromJSON(j, appData) {}

  changeFromJSON(j) {
    // Many change objects can load json directly
    // in the update method.
    this.update(j);
  }

  destroy() {}
}
