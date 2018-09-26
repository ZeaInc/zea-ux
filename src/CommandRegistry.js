class CommandRegistry {
  constructor() {
    this.commands = [];
    this.commandsTree = {};
  }

  registerCommand(command) {
    const { name } = command;

    if (!name) {
      console.warn('A command is missing its name.');
      return;
    }

    if (!command.key) {
      console.warn(`The command '${name}' is missing its key.`);
      return;
    }

    this.commands.push(command);

    command.pathOnMenu.forEach(pathFragment => {
      if (!this.commandsTree[pathFragment]) {
        this.commandsTree[pathFragment] = { children: [] };
      }
      this.commandsTree[pathFragment].children.push(command);
    });

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
