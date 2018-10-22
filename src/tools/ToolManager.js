export default class ToolManager {
  constructor(renderer){
    this.__toolStack = [];

    this.bind(renderer);
  }

  pushTool(tool){
    const currTool = this.currTool();
    if(tool == currTool) {
      console.warn("Tool Already Pushed onthe stack:", tool.constructor.name);
      return;
    }

    this.__toolStack.push(tool);
    tool.activateTool(this.renderer);

    console.log("ToolManager.pushTool:", tool.constructor.name)
  }

  popTool() {
    if(this.__toolStack.length > 0) {
      const prevTool = this.currTool();
      prevTool.deactivateTool(this.renderer);
      this.__toolStack.pop();
      const currTool = this.currTool();
      console.log("ToolManager.popTool:", prevTool.constructor.name, (currTool ? currTool.constructor.name : ''))
    }
  }

  currTool(){
    return this.__toolStack[this.__toolStack.length - 1];
  }


  bind(renderer) {

    this.renderer = renderer;
    const viewport = this.renderer.getViewport();

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

    if (renderer.supportsVR()) {
      renderer.vrViewportSetup.connect(vrvp => {
        /////////////////////////////////////
        // VRController events
        // this.controllerDownId = viewport.controllerDown.connect(this.onVRControllerDown.bind(this))
        // this.controllerMoveId = viewport.controllerMove.connect(this.onVRControllerMove.bind(this))
        // this.controllerUpId = viewport.controllerUp.connect(this.onVRControllerUp.bind(this))
      });
    }
  }

  onMouseDown(event, mousePos, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onMouseDown(event, mousePos, viewport)
  }

  onMouseMove(event, mousePos, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onMouseMove(event, mousePos, viewport)
  }

  onMouseUp(event, mousePos, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onMouseUp(event, mousePos, viewport)
  }

  onWheel(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onWheel(event, viewport)
  }

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onKeyPressed(event, event, viewport)
  }

  onKeyDown(key, event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onKeyDown(key, event, viewport)
  }

  onKeyUp(key, event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onKeyUp(key, event, viewport)
  }

  /////////////////////////////////////
  // Touch events
  onTouchStart(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onTouchStart(event, viewport)
  }

  onTouchMove(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onTouchMove(event, viewport)
  }

  onTouchEnd(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onTouchEnd(event, viewport)
  }

  onTouchCancel(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onMouseDown(event, viewport)
  }

  /////////////////////////////////////
  // VRController events
  onVRControllerDown(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onVRControllerDown(event, viewport)
  }

  onVRControllerMove(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onVRControllerMove(event, viewport)
  }

  onVRControllerUp(event, viewport) {
    const tool = this.currTool();
    if(tool)
      tool.onVRControllerUp(event, viewport)
  }

  destroy() {
    const viewport = this.renderer.getViewport();

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

    if (renderer.supportsVR()) {
      renderer.vrViewportSetup.connect(vrvp => {
        /////////////////////////////////////
        // VRController events
        viewport.controllerDown.disconnectId(this.controllerDownId)
        viewport.controllerMove.disconnectId(this.controllerMoveId)
        viewport.controllerUp.disconnectId(this.controllerUpId)
      });
    }

  }
}