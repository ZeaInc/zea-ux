import { Signal } from '@zeainc/zea-engine'

const __changeClasses = {}
const __classNames = {}
const __classes = []

/** Class representing an undo redo manager. */
class UndoRedoManager {
  /**
   * Create an undo redo manager.
   */
  constructor() {
    this.__undoStack = []
    this.__redoStack = []

    this.changeAdded = new Signal()
    this.changeUpdated = new Signal()
    this.changeUndone = new Signal()
    this.changeRedone = new Signal()

    this.__currChangeUpdated = this.__currChangeUpdated.bind(this)
  }

  /**
   * The flush method.
   */
  flush() {
    for (const change of this.__undoStack) change.destroy()
    this.__undoStack = []
    for (const change of this.__redoStack) change.destroy()
    this.__redoStack = []
  }

  /**
   * The addChange method.
   * @param {any} change - The change param.
   */
  addChange(change) {
    // console.log("AddChange:", change.name)
    if (this.getCurrentChange())
      this.getCurrentChange().updated.disconnect(this.__currChangeUpdated)

    this.__undoStack.push(change)
    change.updated.connect(this.__currChangeUpdated)

    for (const change of this.__redoStack) change.destroy()
    this.__redoStack = []

    this.changeAdded.emit(change)
  }

  /**
   * The getCurrentChange method.
   * @return {any} The return value.
   */
  getCurrentChange() {
    return this.__undoStack[this.__undoStack.length - 1]
  }

  // eslint-disable-next-line require-jsdoc
  __currChangeUpdated(updateData) {
    this.changeUpdated.emit(updateData)
  }

  /**
   * The undo method.
   * @param {boolean} pushOnRedoStack - The pushOnRedoStack param.
   */
  undo(pushOnRedoStack = true) {
    if (this.__undoStack.length > 0) {
      const change = this.__undoStack.pop()
      // console.log("undo:", change.name)
      change.undo()
      if (pushOnRedoStack) {
        this.__redoStack.push(change)
        this.changeUndone.emit()
      }
    }
  }

  /**
   * The redo method.
   */
  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop()
      // console.log("redo:", change.name)
      change.redo()
      this.__undoStack.push(change)
      this.changeRedone.emit()
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
    return new __changeClasses[claName]()
  }

  /**
   * The getChangeClassName method.
   * @param {any} inst - The inst param.
   * @return {any} The return value.
   */
  static getChangeClassName(inst) {
    const id = __classes.indexOf(inst.constructor)
    if (__classNames[id]) return __classNames[id]
    console.warn('Change not registered:', inst.constructor.name)
    return inst.constructor.name
  }

  /**
   * The registerChange method.
   * @param {any} name - The name param.
   * @param {any} cls - The cls param.
   */
  static registerChange(name, cls) {
    if (__classes.indexOf(cls) != -1)
      console.warn("Class already registered:", name)

    const id = __classes.length;
    __classes.push(cls)
    __changeClasses[name] = cls
    __classNames[id] = name
  }
}

export default UndoRedoManager
export { UndoRedoManager }
