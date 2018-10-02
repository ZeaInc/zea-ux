class CommandRegistry {
  constructor() {
    this.commands = [];
  }

  registerCommand(command) {
    const { title } = command;

    if (!title) {
      console.warn('A command is missing its title.');
      return;
    }

    if (!command.key) {
      console.warn(`The command '${title}' is missing its key.`);
      return;
    }

    this._addCommand(command);
  }

  _addCommand(command) {
    this.commands.push(command);
    this._addKeyListener(command);
  }

  _addKeyListener(command) {
    document.addEventListener('keydown', e => {
      const metaKeys = command.metaKeys || {};

      const keyComboExpected =
        this._comboFragment(metaKeys.alt, 'A') +
        this._comboFragment(metaKeys.control, 'C') +
        this._comboFragment(metaKeys.shift, 'S') +
        command.key;

      const keyComboPressed =
        this._comboFragment(e.altKey, 'A') +
        this._comboFragment(e.metaKey || e.ctrlKey, 'C') +
        this._comboFragment(e.shiftKey, 'S') +
        e.key;

      if (keyComboExpected.toLowerCase() === keyComboPressed.toLowerCase()) {
        this._invokeCallback(command.callback, e);
      }
    });
  }

  _comboFragment(condition, fragment) {
    return condition ? fragment : '';
  }

  _invokeCallback(callback, event) {
    event.preventDefault();
    callback();
  }
}

export default CommandRegistry;
