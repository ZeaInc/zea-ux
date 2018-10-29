export default class ToolManager {
  constructor(renderer){
    this.__toolStack = [];

    this.bind(renderer);
  }

  insertTool(tool, index) {
    this.__toolStack.splice(index, 0, tool);
  }

  removeTool(index) {
    this.__toolStack.splice(index, 1);
  }

  pushTool(tool){
    const prevTool = this.currTool();
    if(prevTool) {
      if(tool == prevTool) {
        console.warn("Tool Already Pushed on the stack:", tool.constructor.name);
        return;
      }
      else {
        prevTool.deactivateTool(this.renderer);
      }
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
      const tool = this.currTool();
      if(tool)
        tool.activateTool(this.renderer);
      console.log("ToolManager.popTool:", prevTool.constructor.name, (tool ? tool.constructor.name : ''))
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
        this.controllerDownId = vrvp.controllerButtonDown.connect(this.onVRControllerButtonDown.bind(this))
        this.controllerUpId = vrvp.controllerButtonUp.connect(this.onVRControllerButtonUp.bind(this))
        this.onVRPoseChangedId = vrvp.viewChanged.connect(this.onVRPoseChanged.bind(this))
      });
    }
  }

  onMouseDown(event, mousePos, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onMouseDown(event, mousePos, viewport) == true)
        break;
    }
  }

  onMouseMove(event, mousePos, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onMouseMove(event, mousePos, viewport) == true)
        break;
    }
  }

  onMouseUp(event, mousePos, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onMouseUp(event, mousePos, viewport) == true)
        break;
    }
  }

  onWheel(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onWheel(event, viewport) == true)
        break;
    }
  }

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onKeyPressed(event, event, viewport) == true)
        break;
    }
  }

  onKeyDown(key, event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onKeyDown(key, event, viewport) == true)
        break;
    }
  }

  onKeyUp(key, event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onKeyUp(key, event, viewport) == true)
        break;
    }
  }

  /////////////////////////////////////
  // Touch events
  onTouchStart(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onTouchStart(event, viewport) == true)
        break;
    }
  }

  onTouchMove(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onTouchMove(event, viewport) == true)
        break;
    }
  }

  onTouchEnd(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onTouchEnd(event, viewport) == true)
        break;
    }
  }

  onTouchCancel(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onMouseDown(event, viewport) == true)
        break;
    }
  }

  /////////////////////////////////////
  // VRController events
  onVRControllerButtonDown(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onVRControllerButtonDown(event, viewport) == true)
        break;
    }
  }

  onVRControllerButtonUp(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onVRControllerButtonUp(event, viewport) == true)
        break;
    }
  }

  onVRPoseChanged(event, viewport) {
    let i = this.__toolStack.length;
    while(i--) {
      const tool = this.__toolStack[i];
      if(tool && tool.onVRPoseChanged(event, viewport) == true)
        break;
    }
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
        viewport.controllerUp.disconnectId(this.controllerUpId)
        viewport.viewChanged.disconnectId(this.onVRPoseChangedId)
      });
    }

  }
}