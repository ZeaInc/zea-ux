class CommandRegistry {
  constructor() {
    this.commands = [];
  }

  registerCommand(command) {
    this.commands.push(command);
  }
}

export default CommandRegistry;
