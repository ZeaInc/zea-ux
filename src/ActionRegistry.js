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
    // this._addKeyListener(action);
    this.actionAdded.emit(action);
  }

  getActions() {
    return this.actions;
  }

  // _addKeyListener(action) {
  //   document.addEventListener('keydown', e => {
  //     const metaKeys = action.metaKeys || {};

  //     const keyComboExpected =
  //       this._comboFragment(metaKeys.alt, 'A') +
  //       this._comboFragment(metaKeys.control, 'C') +
  //       this._comboFragment(metaKeys.shift, 'S') +
  //       action.key;

  //     const keyComboPressed =
  //       this._comboFragment(e.altKey, 'A') +
  //       this._comboFragment(e.metaKey || e.ctrlKey, 'C') +
  //       this._comboFragment(e.shiftKey, 'S') +
  //       e.key;

  //     if (keyComboExpected.toLowerCase() === keyComboPressed.toLowerCase()) {
  //       this._invokeCallback(action.callback, e);
  //     }
  //   });
  // }

  // _comboFragment(condition, fragment) {
  //   return condition ? fragment : '';
  // }

  // _invokeCallback(callback, event) {
  //   event.preventDefault();
  //   callback();
  // }
}

export default ActionRegistry;