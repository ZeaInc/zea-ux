class Change {
	constructor(name) {
		this.name = name ? name : this.constructor.name;
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
}

export default Change;