import { Signal } from '@zeainc/zea-engine';

/** Class representing an action registry. */
class ActionRegistry {
  /**
   * Create an action registry.
   */
  constructor() {
    this.actions = [];
    this.actionAdded = new Signal();
  }

  /**
   * The registerAction method.
   * @param {any} action - The action param.
   */
  registerAction(action) {
    const { name } = action;

    if (!name) {
      console.warn('A action is missing its name.');
      return;
    }

    this._addAction(action);
  }

  /**
   * The _addAction method.
   * @param {any} action - The action param.
   */
  _addAction(action) {
    this.actions.push(action);
    this.actionAdded.emit(action);
  }

  /**
   * The getActions method.
   * @return {any} The return value.
   */
  getActions() {
    return this.actions;
  }
}

export default ActionRegistry;
export { ActionRegistry };
