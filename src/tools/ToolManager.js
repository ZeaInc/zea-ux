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
    tool.install(index);
  }

  insertToolBefore(tool, beforeTool) {
    // Note: when activating new tools in VR, we
    // can insert the new tool below the VRUI tool, 
    // so that once the VR UI is closed, it becomes
    // the new active tool.
    const index = this.__toolStack.indexOf(beforeTool)+1;
    this.__toolStack.splice(index-1, 0, tool);
    tool.install(index);
    return index;
  }

  insertToolAfter(tool, afterTool) {
    const index = this.__toolStack.indexOf(afterTool)+1;
    this.__toolStack.splice(index, 0, tool);
    tool.install(index);
    if (index == this.__toolStack.length) {
      tool.activateTool();
    }
    return index;
  }

  getToolIndex(tool) {
    return this.__toolStack.indexOf(tool);
  }

  removeTool(index) {
    const tool = this.__toolStack[index]
    this.__toolStack.splice(index, 1);
    tool.uninstall();
    if (index == this.__toolStack.length) {
      tool.deactivateTool();

      const nextTool = this.currTool();
      if (nextTool)
        nextTool.activateTool();
      else {
        // Make sure to reset the pointer in case any tool 
        // didn't close correctly.
        this.appData.renderer.getDiv().style.cursor = "pointer";
      }
    }
  }

  removeToolByHandle(tool) {
    this.removeTool(this.getToolIndex(tool));
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
    tool.install(this.__toolStack.length - 1);
    tool.activateTool();

    console.log("ToolManager.pushTool:", tool.constructor.name);

    return this.__toolStack.length - 1;
  }
  __removeCurrTool() {
    if (this.__toolStack.length > 0) {
      const prevTool = this.__toolStack.pop();
      prevTool.deactivateTool();
      prevTool.uninstall();
    }
  }

  popTool() {
    this.__removeCurrTool();
    const tool = this.currTool();
    if (tool)
      tool.activateTool();
    // console.log("ToolManager.popTool:", prevTool.constructor.name, (tool ? tool.constructor.name : ''))
  }

  replaceCurrentTool(tool) {
    this.__removeCurrTool();
    this.__toolStack.push(tool);
    tool.install(this.__toolStack.length - 1);
    tool.activateTool();
  }

  currTool() {
    return this.__toolStack[this.__toolStack.length - 1];
  }

  currToolName() {
    return this.__toolStack[this.__toolStack.length - 1].getName();
  }


  bind(renderer) {

    const viewport = renderer.getViewport();

    this.mouseDownId = viewport.mouseDown.connect(this.onMouseDown.bind(this))
    this.mouseMovedId = viewport.mouseMoved.connect(this.onMouseMove.bind(this))
    this.mouseUpId = viewport.mouseUp.connect(this.onMouseUp.bind(this))
    this.mouseLeaveId = viewport.mouseLeave.connect(this.onMouseLeave.bind(this))
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

    this.appData.renderer.getXRViewport().then(xrvp => {
      /////////////////////////////////////
      // VRController events
      this.controllerDownId = xrvp.controllerButtonDown.connect(this.onVRControllerButtonDown.bind(this));
      this.controllerUpId = xrvp.controllerButtonUp.connect(this.onVRControllerButtonUp.bind(this));
      this.onVRPoseChangedId = xrvp.viewChanged.connect(this.onVRPoseChanged.bind(this));
    });
  }

  onMouseDown(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
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
    event.undoRedoManager = this.appData.undoRedoManager;
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
    event.undoRedoManager = this.appData.undoRedoManager;
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

  onMouseLeave(event) {
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onMouseLeave && tool.onMouseLeave(event) == true)
        break;
    }
    if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false;
      this.hidePointer.emit();
    }
  }

  onWheel(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
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
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyPressed(event, event, viewport) == true)
        break;
    }
  }

  onKeyDown(key, event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onKeyDown(key, event) == true)
        break;
    }
  }

  onKeyUp(key, event) {
    event.undoRedoManager = this.appData.undoRedoManager;
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
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchStart(event) == true)
        break;
    }
  }

  onTouchMove(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchMove(event) == true)
        break;
    }
  }

  onTouchEnd(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onTouchEnd(event) == true)
        break;
    }
  }

  onTouchCancel(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
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
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonDown(event) == true)
        break;
    }
  }

  onVRControllerButtonUp(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
    let i = this.__toolStack.length;
    while (i--) {
      const tool = this.__toolStack[i];
      if (tool && tool.onVRControllerButtonUp(event) == true)
        break;
    }
  }

  onVRPoseChanged(event) {
    event.undoRedoManager = this.appData.undoRedoManager;
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
    viewport.mouseLeave.disconnectId(this.mouseUpId)
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

    this.appData.renderer.getXRViewport().then(xrvp => {
      /////////////////////////////////////
      // VRController events
      viewport.controllerDown.disconnectId(this.controllerDownId)
      viewport.controllerUp.disconnectId(this.controllerUpId)
      viewport.viewChanged.disconnectId(this.onVRPoseChangedId)
    });

  }
}