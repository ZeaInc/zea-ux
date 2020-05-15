import { Signal } from '@zeainc/zea-engine'

const __changeClasses = {}
const __classNames = {}
const __classes = []

/**
 * UndoRedoMAnager is a mixture of the [Factory Design Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) and the actual changes stacks manager.
 * This is the heart of the Undo/Redo System, letting you navigate through the changes history you've saved.
 *
 * This relies on the [Signal](https://github.com/ZeaInc/zea-engine) notification system, when a change is added, updated, undone, redone or cancelled.
 */
class UndoRedoManager {
  /**
   * It doesn't have any parameters, but under the hood it initializes the signals to notify subscribers when something happens. 
   * The implementation is really simple, just initialize it like any other class.
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
   * As the name indicates, it empties undo/redo stacks permanently, losing all stored actions.
   * Right now, before flushing the stacks it calls the `destroy` method on all changes, ensure to at least declare it.
   */
  flush() {
    for (const change of this.__undoStack) change.destroy()
    this.__undoStack = []
    for (const change of this.__redoStack) change.destroy()
    this.__redoStack = []
  }

  /**
   * Recieves an instance of a class that extends or has the same structure as the `Change` class.
   * When this action happens, the last added change update notificatons will get disconnected.
   * Which implies that any future updates to changes that are not the last one would need a new call to the "addChange" method.
   * Also, resets the redo stack(Calls destroy method when doing it).
   * changeAdded event is emitted, if you want to subscribe, just `yourChange.changeAdded.connect(() => {...})`
   *
   * @param {Change} change - Instantiated class derived from the `Change` class.
   */
  addChange(change) {
    if (this.getCurrentChange())
      this.getCurrentChange().updated.disconnect(this.__currChangeUpdated)

    this.__undoStack.push(change)
    change.updated.connect(this.__currChangeUpdated)

    for (const change of this.__redoStack) change.destroy()
    this.__redoStack = []

    this.changeAdded.emit(change)
  }

  /**
   * Returns the last change added to the undo stack, but in case it is empty a `null` is returned.
   *
   * @return {Change | null} The return value.
   */
  getCurrentChange() {
    return this.__undoStack ? this.__undoStack[this.__undoStack - 1] : null
  }

  // eslint-disable-next-line require-jsdoc
  __currChangeUpdated(updateData) {
    this.changeUpdated.emit(updateData)
  }

  /**
   * Rollback the latest action, passing it to the redo stack in case you wanna recover it later on.
   *
   * Emits the `changeUndone` event, if you want to subscribe to it.
   * @param {boolean} pushOnRedoStack - The pushOnRedoStack param.
   */
  undo(pushOnRedoStack = true) {
    if (this.__undoStack.length > 0) {
      const change = this.__undoStack.pop()
      change.undo()
      if (pushOnRedoStack) {
        this.__redoStack.push(change)
        this.changeUndone.emit()
      }
    }
  }

  /**
   * Rollbacks the `undo` action by moving the change from the `redo` stack to the `undo` stack.
   * Emits the `changeRedone` event, if you want to subscribe to it.
   */
  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop()
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
