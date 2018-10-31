

import UndoRedoManager from './UndoRedoManager.js';

export default class Change {
  constructor(name) {
    this.name = name ? name : UndoRedoManager.getChangeClassName(this);

    this.updated = new Visualive.Signal();
  }

  undo() {
    throw("Implement me");
  }

  redo() {
    throw("Implement me");
  }

  update(updateData) {
    throw("Implement me");
  }

  toJSON(appData) { 
    return {
     name: this.name
   }
  }

  fromJSON(j, appData) {
    this.name = j.name;
  }


  changeFromJSON(j) {
    // Many change objects can load json directly
    // in the update method.
    this.update(j);
  }
  
  destroy() {
  }
}
