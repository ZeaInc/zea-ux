import { EventEmitter } from '@zeainc/zea-engine'

const __changeClasses = {}
const __classNames = {}
const __classes = []

/** Class representing an undo redo manager. */
class UndoRedoManager extends EventEmitter {
  /**
   * Create an undo redo manager.
   */
  constructor() {
    super()
    this.__undoStack = []
    this.__redoStack = []
    this.__currChange = null

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
    if (this.__currChange) {
      this.__currChange.off('updated', this.__currChangeUpdated)
      this.__currChange = null
    }
  }

  /**
   * The addChange method.
   * @param {any} change - The change param.
   */
  addChange(change) {
    // console.log("AddChange:", change.name)
    if (this.__currChange) {
      this.__currChange.off('updated', this.__currChangeUpdated)
    }

    this.__undoStack.push(change)
    this.__currChange = change
    this.__currChange.on('updated', this.__currChangeUpdated)

    for (const change of this.__redoStack) change.destroy()
    this.__redoStack = []

    this.emit('changeAdded', { change })
  }

  /**
   * The getCurrentChange method.
   * @return {any} The return value.
   */
  getCurrentChange() {
    return this.__currChange
  }

  // eslint-disable-next-line require-jsdoc
  __currChangeUpdated(updateData) {
    this.emit('changeUpdated', updateData)
  }

  /**
   * The undo method.
   * @param {boolean} pushOnRedoStack - The pushOnRedoStack param.
   */
  undo(pushOnRedoStack = true) {
    if (this.__undoStack.length > 0) {
      if (this.__currChange) {
        this.__currChange.off('updated', this.__currChangeUpdated)
        this.__currChange = null
      }

      const change = this.__undoStack.pop()
      // console.log("undo:", change.name)
      change.undo()
      if (pushOnRedoStack) {
        this.__redoStack.push(change)
        this.emit('changeUndone')
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
      this.emit('changeRedone')
    }
  }

  // //////////////////////////////////
  // User Synchronization

  /**
   * The constructChange method.
   * @param {string} className - The className param.
   * @return {any} The return value.
   */
  constructChange(className) {
    return new __changeClasses[className]()
  }

  /**
   * The isChangeClassRegistered method.
   * @param {object} inst - The instance of the Change class.
   * @return {boolean} Returns 'true' if the class has been registered.
   */
  static isChangeClassRegistered(inst) {
    const id = __classes.indexOf(inst.constructor)
    return id != -1
  }

  /**
   * The getChangeClassName method.
   * @param {object} inst - The instance of the Change class.
   * @return {any} The return value.
   */
  static getChangeClassName(inst) {
    const id = __classes.indexOf(inst.constructor)
    if (__classNames[id]) return __classNames[id]
    console.warn('Change not registered:', inst.constructor.name)
    return ''
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
