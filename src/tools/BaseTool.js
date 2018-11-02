
export default class BaseTool extends Visualive.ParameterOwner {
  constructor(appData) {
    super();
    if(!appData)
      console.error("App data not provided to tool")
    this.appData = appData;

    this.actionFinished = new Visualive.Signal();

    this.__params = []
    this.__installed = false;
    this.__activated = false;
  }

  /////////////////////////////////////
  // Tools on the tool stack.

  installed(index) {
    this.index = index;
    this.__installed = true;
  }

  uninstalled() {
    this.__installed = false;
  }

  activateTool() {
    if(this.__activated)
      throw("Tool already activate")
    this.__activated = true;
  }

  deactivateTool() {
    this.__activated = false;
  }

  /////////////////////////////////////
  // Mouse events

  onMouseDown(event) {}

  onMouseMove(event) {}

  onMouseUp(event) {}

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

  /////////////////////////////////////
  // VRController events
  onVRControllerButtonDown(event) {}

  onVRControllerButtonUp(event) {}

  onVRPoseChanged(event) {}

};
