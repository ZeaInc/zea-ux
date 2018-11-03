export default class ToolManager {
  constructor(appData) {
    this.__toolStack = [];
    this.appData = appData;

    this.movePointer = new Visualive.Signal();
    this.hilightPointer = new Visualive.Signal();
    this.unhilightPointer = new Visualive.Signal();
    this.hidePointer = new Visualive.Signal();
    this.avatarPointerVisible = false;
    this.avatarPointerHighlighted = false;
  }

  insertTool(tool, index) {
    this.__toolStack.splice(index, 0, tool);
    tool.installed(index);
  }

  removeTool(index) {
    const tool = this.__toolStack[index]
    this.__toolStack.splice(index, 1);
    tool.uninstalled();
    if (index == this.__toolStack.length) {
      tool.deactivateTool();

      const nextTool = this.currTool();
      if (nextTool)
        nextTool.activateTool();
    }
  }

  pushTool(tool) {
    const prevTool = this.currTool();
    if (prevTool) {
      if (tool == prevTool) {
        console.warn("Tool Already Pushed on the stack:", tool.constructor.name);
        return;
      } else {
        // Note: only the lead tool is 'active' and displaying an icon. 
        // A tool can recieve events even if not active, if it is on 
        // the stack.
        prevTool.deactivateTool();
      }
    }

    this.__toolStack.push(tool);
    tool.installed(this.__toolStack.length - 1);
    tool.activateTool();

    console.log("ToolManager.pushTool:", tool.constructor.name);

    return this.__toolStack.length - 1;
  }

  popTool() {
    if (this.__toolStack.length > 0) {
      const prevTool = this.__toolStack.pop();
      prevTool.deactivateTool();
      prevTool.uninstalled();

      const tool = this.currTool();
      if (tool)
        tool.activateTool();
      console.log("ToolManager.popTool:", prevTool.constructor.name, (tool ? tool.constructor.name : ''))
    }
  }

  currTool() {
    return this.__toolStack[this.__toolStack.length - 1];
  }


  bind(renderer) {

    const viewport = renderer.getViewport();

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
        if (!vrvp != this.__vrvp) {
          this.__vrvp = vrvp;
          this.controllerDownId = vrvp.controllerButtonDown.connect(this.onVRControllerButtonDown.bind(this));
          this.controllerUpId = vrvp.controllerButtonUp.connect(this.onVRControllerButtonUp.bind(this));
          this.onVRPoseChangedId = vrvp.viewChanged.connect(this.onVRPoseChanged.bind(this));
        }
      });
    }
  }

  onMouseDown(event) {
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseDown(event) == true)
        break;
    }

    if (event.showPointerOnAvatar == true) {
      if (!this.avatarPointerVisible) {
        this.movePointer.emit(event);
        this.avatarPointerVisible = true;
      }
      if (!this.avatarPointerHighlighted) {
        this.hilightPointer.emit(event);
        this.avatarPointerHighlighted = true;
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.hidePointer.emit();
    }
  }

  onMouseMove(event) {
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseMove(event) == true)
        break;
    }
    if (event.showPointerOnAvatar == true) {
      this.movePointer.emit(event);
      this.avatarPointerVisible = true;
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.hidePointer.emit();
    }
  }

  onMouseUp(event) {
    event.showPointerOnAvatar = true;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseUp(event) == true)
        break;
    }
    if (event.showPointerOnAvatar == true) {
      if (this.avatarPointerHighlighted) {
        this.unhilightPointer.emit(event);
        this.avatarPointerHighlighted = false;
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.hidePointer.emit();
    }
  }

  onWheel(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onWheel(event) == true)
        break;
    }
  }

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyPressed(event, event, viewport) == true)
        break;
    }
  }

  onKeyDown(key, event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyDown(key, event) == true)
        break;
    }
  }

  onKeyUp(key, event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyUp(key, event) == true)
        break;
    }
  }

  /////////////////////////////////////
  // Touch events
  onTouchStart(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchStart(event) == true)
        break;
    }
  }

  onTouchMove(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchMove(event) == true)
        break;
    }
  }

  onTouchEnd(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchEnd(event) == true)
        break;
    }
  }

  onTouchCancel(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseDown(event) == true)
        break;
    }
  }

  /////////////////////////////////////
  // VRController events
  onVRControllerButtonDown(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonDown(event) == true)
        break;
    }
  }

  onVRControllerButtonUp(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonUp(event) == true)
        break;
    }
  }

  onVRPoseChanged(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRPoseChanged(event) == true)
        break;
    }
  }


  destroy() {
    const viewport = this.appData.renderer.getViewport();

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

    if (this.appData.renderer.supportsVR()) {
      const vrviewport = this.appData.renderer.getVRViewport();
      if (vrviewport) {
        /////////////////////////////////////
        // VRController events
        viewport.controllerDown.disconnectId(this.controllerDownId)
        viewport.controllerUp.disconnectId(this.controllerUpId)
        viewport.viewChanged.disconnectId(this.onVRPoseChangedId)
      };
    }

  }
}