

import UndoRedoManager from './UndoRedoManager.js';

export default class Change {
  constructor(name) {
    this.name = name ? name : UndoRedoManager.getChangeClassName(this);
  }

  undo() {}

  redo() {}


  update(updateData) {}

  toJSON() { 
    return {
     name: this.name
   }
  }

  fromJSON(j) {
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
