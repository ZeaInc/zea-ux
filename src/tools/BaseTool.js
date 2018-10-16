class BaseTool extends Visualive.ParameterOwner {
  constructor(undoRedoManager) {
    super();
    this.undoRedoManager = undoRedoManager;

    this.actionFinished = new Visualive.Signal()
  }

  activateTool(viewport) {

    this.viewport = viewport;

    this.mouseDownId = viewport.mouseDown.connect(this.onMouseDown.bind(this))
    this.mouseMovedId = viewport.mouseMoved.connect(this.onMouseMove.bind(this))
    this.mouseUpId = viewport.mouseUp.connect(this.onMouseUp.bind(this))
    this.mouseWheelId = viewport.mouseWheel.connect(this.onWheel.bind(this))

    /////////////////////////////////////
    // Keyboard events
    this.keyDownId = viewport.keyDown.connect(this.onKeyDown.bind(this))
    this.keyUpId = viewport.keyUp.connect(this.onKeyUp.bind(this))
    this.keyPressedId = viewport.keyPressed.connect(this.onKeyPressed.bind(this))

    /////////////////////////////////////
    // Touch events
    this.touchStartId = viewport.touchStart.connect(this.onTouchStart.bind(this))
    this.touchMoveId = viewport.touchMove.connect(this.onTouchMove.bind(this))
    this.touchEndId = viewport.touchEnd.connect(this.onTouchEnd.bind(this))
    this.touchCancelId = viewport.touchCancel.connect(this.onTouchCancel.bind(this))

    /////////////////////////////////////
    // VRController events
    // this.controllerDownId = viewport.controllerDown.connect(this.onVRControllerDown.bind(this))
    // this.controllerMoveId = viewport.controllerMove.connect(this.onVRControllerMove.bind(this))
    // this.controllerUpId = viewport.controllerUp.connect(this.onVRControllerUp.bind(this))

  }

  deactivateTool() {

    viewport.mouseDown.disconnectId(this.mouseDownId)
    viewport.mouseMoved.disconnectId(this.mouseMovedId)
    viewport.mouseUp.disconnectId(this.mouseUpId)
    viewport.mouseWheel.disconnectId(this.mouseWheelId)

    /////////////////////////////////////
    // Keyboard events
    viewport.keyDown.disconnectId(this.keyDownId)
    viewport.keyUp.disconnectId(this.keyUpId)
    viewport.keyPressed.disconnectId(this.keyPressedId)

    /////////////////////////////////////
    // Touch events
    viewport.touchStart.disconnectId(this.touchStartId)
    viewport.touchMove.disconnectId(this.touchMoveId)
    viewport.touchEnd.disconnectId(this.touchEndId)
    viewport.touchCancel.disconnectId(this.touchCancelId)

    /////////////////////////////////////
    // VRController events
    viewport.controllerDown.disconnectId(this.controllerDownId)
    viewport.controllerMove.disconnectId(this.controllerMoveId)
    viewport.controllerUp.disconnectId(this.controllerUpId)

  }

  /////////////////////////////////////
  // Mouse events

  screenPosToXfo(screenPos, viewport) {
    // 

    const camera = viewport.getCamera();

    const ray = viewport.calcRayFromScreenPos(screenPos);

    // Raycast any working planes.


    // else project based on focal dist.
    const xfo = camera.getGlobalXfo().clone();
    xfo.tr = ray.pointAtDist(camera.getFocalDistance());
    return xfo;
  }


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
  onVRControllerDown(event, viewport) {}

  onVRControllerMove(event, viewport) {}

  onVRControllerUp(event, viewport) {}

};

export {
  BaseTool
};