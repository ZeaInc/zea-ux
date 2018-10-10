class UndoRedoManager {
  constructor() {
    this.__undoStack = [];
    this.__redoStack = [];
  }

  addChange(change) {
    this.__undoStack.push(change);
    this.__redoStack = [];
  }

  undo() {
    if (this.__undoStack.length > 0) {
      const change = this.__undoStack.pop();
      change.undo();
      this.__redoStack.push(change);
    }
  }

  redo() {
    if (this.__redoStack.length > 0) {
      const change = this.__redoStack.pop();
      change.redo();
      this.__undoStack.push(change);
    }
  }
}

export default UndoRedoManager;
