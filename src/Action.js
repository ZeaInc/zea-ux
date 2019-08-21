/** Class representing an action. */
export default class Action {
  /**
   * Create an action.
   * @param {any} name - The name value.
   * @param {any} path - The path value.
   * @param {boolean} availableInVR - The availableInVR value.
   */
  constructor(name, path, availableInVR = false) {
    this.name = name;
    this.path = path;
    this.availableInVR = availableInVR;

    this.callback = this.callback.bind(this);
  }

  /**
   * The callback method.
   */
  callback() {}
}
