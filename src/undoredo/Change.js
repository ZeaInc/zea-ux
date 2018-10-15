class Change {
	constructor(name) {
		this.name = name;
	}

	undo() {}

	redo() {}

	toJSON() {}

	fromJSON(j) {}
}

export default Change;