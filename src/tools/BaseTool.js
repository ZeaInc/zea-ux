/**
 * Class representing a base tool.
 * @extends Visualive.ParameterOwner
 */
export default class BaseTool extends Visualive.ParameterOwner {
  /**
   * Create a base tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super();
    if (!appData) console.error('App data not provided to tool');
    this.appData = appData;

    // When the tool becomes active ready
    this.installChanged = new Visualive.Signal();
    this.activatedChanged = new Visualive.Signal();
    this.actionFinished = new Visualive.Signal();

    this.__params = [];
    this.__installed = false;
    this.__activated = false;
  }

  getName() {
    return this.constructor.name;
  }

  isPrimaryTool() {
    return false;
  }

  /////////////////////////////////////
  // Tools on the tool stack.

  installed() {
    return this.__installed;
  }

  install(index) {
    if (this.__installed) throw 'Tool already installed';
    this.index = index;
    this.__installed = true;
    this.installChanged.emit(true);
  }

  uninstall() {
    this.__installed = false;
    this.installChanged.emit(false);
  }

  activateTool() {
    if (this.__activated) throw 'Tool already activate';
    this.__activated = true;
    this.activatedChanged.emit(true);
  }

  deactivateTool() {
    this.__activated = false;
    this.activatedChanged.emit(false);
  }

  /////////////////////////////////////
  // Mouse events

  onMouseDown(event) {}

  onMouseMove(event) {}

  onMouseUp(event) {}

  onDoubleClick(event) {}

  onWheel(event) {}

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event) {}

  onKeyDown(key, event) {}

  onKeyUp(key, event) {}

  /////////////////////////////////////
  // Touch events
  onTouchStart(event) {}

  onTouchMove(event) {}

  onTouchEnd(event) {}

  onTouchCancel(event) {}

  onDoubleTap(event) {}

  /////////////////////////////////////
  // VRController events
  onVRControllerButtonDown(event) {}

  onVRControllerButtonUp(event) {}

  onVRControllerDoubleClicked(event) {}

  onVRPoseChanged(event) {}
}
