export default class Action {
  constructor(name, path, availableInVR = false) {
    this.name = name;
    this.path = path;
    this.availableInVR = availableInVR;

    this.callback = this.callback.bind(this);
  }

  callback() {}
}
