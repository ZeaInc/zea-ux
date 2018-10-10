import {
  Signal
} from './Signal.js'


class ActionRegistry {
  constructor() {
    this.actions = [];
    this.actionAdded = new Signal();
  }

  registerAction(action) {
    const {
      name
    } = action;

    if (!name) {
      console.warn('A action is missing its name.');
      return;
    }

    this._addAction(action);
  }

  _addAction(action) {
    this.actions.push(action);
    this.actionAdded.emit(action);
  }

  getActions() {
    return this.actions;
  }
}

export default ActionRegistry;