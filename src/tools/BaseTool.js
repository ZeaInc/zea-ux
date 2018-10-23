
export default class BaseTool extends Visualive.ParameterOwner {
  constructor(undoRedoManager) {
    super();
    this.undoRedoManager = undoRedoManager;

    this.actionFinished = new Visualive.Signal();

    this.__params = []
  }

  /////////////////////////////////////


  activateTool(renderer) {
  }

  deactivateTool(renderer) {

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
