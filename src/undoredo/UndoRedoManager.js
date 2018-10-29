// import * as Visualive from '@visualive/engine';

const __changeClasses = {};
const __classNames = {};

class UndoRedoManager {
  constructor() {
    this.__undoStack = [];
    this.__redoStack = [];

    this.changeAdded = new Visualive.Signal();
    this.changeUpdated = new Visualive.Signal();
    this.changeUndone = new Visualive.Signal();
    this.changeRedone = new Visualive.Signal();
  }

  flush(){
    for(let change of this.__undoStack)
      change.destroy()
    this.__undoStack = [];
    for(let change of this.__redoStack)
      change.destroy()
    this.__redoStack = [];
  }

  addChange(change) {
    this.__undoStack.push(change);
    for(let change of this.__redoStack)
      change.destroy()
    this.__redoStack = [];

    this.changeAdded.emit(change);
  }

  getCurrentChange() {
    return this.__undoStack[this.__undoStack.length - 1];
  }

  updateChange(updateData) {
    if (this.__undoStack.length > 0) {
      const change = this.getCurrentChange();
      change.update(updateData);
      this.changeUpdated.emit(updateData);
    }
  }

  undo(pushOnRedoStack=true) {
    if (this.__undoStack.length > 0) {
      const change = this.__undoStack.pop();
      change.undo();
      if(pushOnRedoStack) {
        this.__redoStack.push(change);
        this.changeUndone.emit();
      }
    }
  }

  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop();
      change.redo();
      this.__undoStack.push(change);
      this.changeRedone.emit();
    }
  }

  ////////////////////////////////////
  // User Synchronization

  constructChange(claName) {
    return new __changeClasses[claName]();
  }

  static getChangeClassName(inst){
    if(__classNames[inst.constructor.name])
      return __classNames[inst.constructor.name];
    console.warn("Change not registered:", inst.constructor.name);
    return inst.constructor.name;
  }

  static registerChange(name, cls) {
    __changeClasses[name] = cls;
    __classNames[cls.name] = name;
  }
}

export default UndoRedoManager;
