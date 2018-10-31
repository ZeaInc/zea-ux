
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

  onMouseDown(event, mousePos, viewport) {}

  onMouseMove(event, mousePos, viewport) {}

  onMouseUp(event, mousePos, viewport) {}

  onWheel(event, viewport) {}

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event, viewport) {}

  onKeyDown(key, event, viewport) {}

  onKeyUp(key, event, viewport) {}

  /////////////////////////////////////
  // Touch events
  onTouchStart(event, viewport) {}

  onTouchMove(event, viewport) {}

  onTouchEnd(event, viewport) {}

  onTouchCancel(event, viewport) {}

  /////////////////////////////////////
  // VRController events
  onVRControllerButtonDown(event, viewport) {}

  onVRControllerButtonUp(event, viewport) {}

  onVRPoseChanged(event, viewport) {}

};
