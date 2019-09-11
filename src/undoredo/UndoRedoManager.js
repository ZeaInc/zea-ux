const __changeClasses = {};
const __classNames = {};

/** Class representing an undo redo manager. */
class UndoRedoManager {
  /**
   * Create an undo redo manager.
   */
  constructor() {
    this.__undoStack = [];
    this.__redoStack = [];

    this.changeAdded = new ZeaEngine.Signal();
    this.changeUpdated = new ZeaEngine.Signal();
    this.changeUndone = new ZeaEngine.Signal();
    this.changeRedone = new ZeaEngine.Signal();

    this.__currChangeUpdated = this.__currChangeUpdated.bind(this);
  }

  /**
   * The flush method.
   */
  flush() {
    for (const change of this.__undoStack) change.destroy();
    this.__undoStack = [];
    for (const change of this.__redoStack) change.destroy();
    this.__redoStack = [];
  }

  /**
   * The addChange method.
   * @param {any} change - The change param.
   */
  addChange(change) {
    if (this.getCurrentChange())
      this.getCurrentChange().updated.disconnect(this.__currChangeUpdated);

    this.__undoStack.push(change);
    change.updated.connect(this.__currChangeUpdated);

    for (const change of this.__redoStack) change.destroy();
    this.__redoStack = [];

    this.changeAdded.emit(change);
  }

  /**
   * The getCurrentChange method.
   * @return {any} The return value.
   */
  getCurrentChange() {
    return this.__undoStack[this.__undoStack.length - 1];
  }

  // eslint-disable-next-line require-jsdoc
  __currChangeUpdated(updateData) {
    this.changeUpdated.emit(updateData);
  }

  /**
   * The undo method.
   * @param {boolean} pushOnRedoStack - The pushOnRedoStack param.
   */
  undo(pushOnRedoStack = true) {
    if (this.__undoStack.length > 0) {
      const change = this.__undoStack.pop();
      change.undo();
      if (pushOnRedoStack) {
        this.__redoStack.push(change);
        this.changeUndone.emit();
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop();
      change.redo();
      this.__undoStack.push(change);
      this.changeRedone.emit();
    }
  }

  // //////////////////////////////////
  // User Synchronization

  /**
   * The constructChange method.
   * @param {any} claName - The claName param.
   * @return {any} The return value.
   */
  constructChange(claName) {
    return new __changeClasses[claName]();
  }

  /**
   * The getChangeClassName method.
   * @param {any} inst - The inst param.
   * @return {any} The return value.
   */
  static getChangeClassName(inst) {
    if (__classNames[inst.constructor.name])
      return __classNames[inst.constructor.name];
    console.warn('Change not registered:', inst.constructor.name);
    return inst.constructor.name;
  }

  /**
   * The registerChange method.
   * @param {any} name - The name param.
   * @param {any} cls - The cls param.
   */
  static registerChange(name, cls) {
    __changeClasses[name] = cls;
    __classNames[cls.name] = name;
  }
}

export default UndoRedoManager;
export { UndoRedoManager };
