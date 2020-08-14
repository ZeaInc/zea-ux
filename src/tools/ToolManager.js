/**
 * Class representing a tool manager.
 */
class ToolManager {
  /**
   * Creates an instance of ToolManager.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    this.__toolStack = []
    this.appData = appData

    this.avatarPointerVisible = false
    this.avatarPointerHighlighted = false
  }

  /**
   * The insertTool method.
   *
   * @param {BaseTool} tool - The tool param.
   * @param {number} index - The index param.
   */
  insertTool(tool, index) {
    this.__toolStack.splice(index, 0, tool)
    tool.install(index)
  }

  /**
   * The insertToolBefore method.
   *
   * @param {BaseTool} tool - The tool param.
   * @param {BaseTool} beforeTool - The beforeTool param.
   * @return {number} The return value.
   */
  insertToolBefore(tool, beforeTool) {
    // Note: when activating new tools in VR, we
    // can insert the new tool below the VRUI tool,
    // so that once the VR UI is closed, it becomes
    // the new active tool.
    const index = this.__toolStack.indexOf(beforeTool) + 1
    this.__toolStack.splice(index - 1, 0, tool)
    tool.install(index)
    return index
  }

  /**
   * The insertToolAfter method.
   *
   * @param {BaseTool} tool - The tool param.
   * @param {BaseTool} afterTool - The afterTool param.
   * @return {number} The return value.
   */
  insertToolAfter(tool, afterTool) {
    const index = this.__toolStack.indexOf(afterTool) + 1
    this.__toolStack.splice(index, 0, tool)
    tool.install(index)
    if (index == this.__toolStack.length) {
      tool.activateTool()
    }
    return index
  }

  /**
   * The getToolIndex method.
   *
   * @param {BaseTool} tool - The tool param.
   * @return {number} The return value.
   */
  getToolIndex(tool) {
    return this.__toolStack.indexOf(tool)
  }

  /**
   * The removeTool method.
   *
   * @param {number} index - The index param.
   */
  removeTool(index) {
    const tool = this.__toolStack[index]
    this.__toolStack.splice(index, 1)
    tool.uninstall()
    if (index == this.__toolStack.length) {
      tool.deactivateTool()

      const nextTool = this.currTool()
      if (nextTool) nextTool.activateTool()
      else {
        // Make sure to reset the pointer in case any tool
        // didn't close correctly.
        this.appData.renderer.getDiv().style.cursor = 'pointer'
      }
    }
  }

  /**
   * The removeToolByHandle method.
   *
   * @param {BaseTool} tool - The tool param.
   */
  removeToolByHandle(tool) {
    this.removeTool(this.getToolIndex(tool))
  }

  /**
   * The pushTool method.
   *
   * @param {BaseTool} tool - The tool param.
   * @return {number} The return value.
   */
  pushTool(tool) {
    const prevTool = this.currTool()
    if (prevTool) {
      if (tool == prevTool) {
        console.warn('Tool Already Pushed on the stack:', tool.constructor.name)
        return
      } else {
        // Note: only the lead tool is 'active' and displaying an icon.
        // A tool can recieve events even if not active, if it is on
        // the stack.
        prevTool.deactivateTool()
      }
    }

    this.__toolStack.push(tool)
    tool.install(this.__toolStack.length - 1)
    tool.activateTool()

    console.log('ToolManager.pushTool:', tool.constructor.name)

    return this.__toolStack.length - 1
  }

  /**
   *
   * @private
   */
  __removeCurrTool() {
    if (this.__toolStack.length > 0) {
      const prevTool = this.__toolStack.pop()
      prevTool.deactivateTool()
      prevTool.uninstall()
    }
  }

  /**
   * The popTool method.
   */
  popTool() {
    this.__removeCurrTool()
    const tool = this.currTool()
    if (tool) tool.activateTool()
    // console.log("ToolManager.popTool:", prevTool.constructor.name, (tool ? tool.constructor.name : ''))
  }

  /**
   * The replaceCurrentTool method.
   *
   * @param {BaseTool} tool - The tool param.
   */
  replaceCurrentTool(tool) {
    this.__removeCurrTool()
    this.__toolStack.push(tool)
    tool.install(this.__toolStack.length - 1)
    tool.activateTool()
  }

  /**
   * The currTool method.
   *
   * @return {BaseTool} The return value.
   */
  currTool() {
    return this.__toolStack[this.__toolStack.length - 1]
  }

  /**
   * The currToolName method.
   *
   * @return {string} The return value.
   */
  currToolName() {
    return this.__toolStack[this.__toolStack.length - 1].getName()
  }

  /**
   * The bind method.
   *
   * @param {GLBaseRenderer} renderer - The renderer param.
   */
  bind(renderer) {
    const viewport = renderer.getViewport()

    this.mouseDownId = viewport.on('mouseDown', this.onMouseDown.bind(this))
    this.mouseMoveId = viewport.on('mouseMove', this.onMouseMove.bind(this))
    this.mouseUpId = viewport.on('mouseUp', this.onMouseUp.bind(this))
    this.mouseLeaveId = viewport.on('mouseLeave', this.onMouseLeave.bind(this))
    this.mouseDoubleClickedId = viewport.on('mouseDoubleClicked', this.onDoubleClick.bind(this))
    this.mouseWheelId = viewport.on('mouseWheel', this.onWheel.bind(this))

    // ///////////////////////////////////
    // Keyboard events
    this.keyDownId = viewport.on('keyDown', this.onKeyDown.bind(this))
    this.keyUpId = viewport.on('keyUp', this.onKeyUp.bind(this))
    this.keyPressedId = viewport.on('keyPressed', this.onKeyPressed.bind(this))

    // ///////////////////////////////////
    // Touch events
    this.touchStartId = viewport.on('touchStart', this.onTouchStart.bind(this))
    this.touchMoveId = viewport.on('touchMove', this.onTouchMove.bind(this))
    this.touchEndId = viewport.on('touchEnd', this.onTouchEnd.bind(this))
    this.touchCancelId = viewport.on('touchCancel', this.onTouchCancel.bind(this))
    this.doubleTappedId = viewport.on('doubleTapped', this.onDoubleTap.bind(this))

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // ///////////////////////////////////
      // VRController events
      this.controllerDownId = xrvp.on('controllerButtonDown', this.onVRControllerButtonDown.bind(this))
      this.controllerUpId = xrvp.on('controllerButtonUp', this.onVRControllerButtonUp.bind(this))
      this.controllerDoubleClickId = xrvp.on('controllerDoubleClicked', this.onVRControllerDoubleClicked.bind(this))
      this.onVRPoseChangedId = xrvp.on('viewChanged', this.onVRPoseChanged.bind(this))
    })
  }

  /**
   * The onMouseDown method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseDown(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    event.showPointerOnAvatar = true
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onMouseDown(event) == true) break
    }

    if (event.showPointerOnAvatar == true) {
      if (!this.avatarPointerVisible) {
        this.emit('movePointer', event)
        this.avatarPointerVisible = true
      }
      if (!this.avatarPointerHighlighted) {
        this.emit('hilightPointer', event)
        this.avatarPointerHighlighted = true
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false
      this.emit('hidePointer')
    }
  }

  /**
   * The onMouseMove method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseMove(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    event.showPointerOnAvatar = true
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onMouseMove(event) == true) break
    }
    if (event.showPointerOnAvatar == true) {
      this.emit('movePointer', event)
      this.avatarPointerVisible = true
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false
      this.emit('hidePointer')
    }
  }

  /**
   * The onMouseUp method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseUp(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    event.showPointerOnAvatar = true
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onMouseUp(event) == true) break
    }
    if (event.showPointerOnAvatar == true) {
      if (this.avatarPointerHighlighted) {
        this.emit('unhilightPointer', event)
        this.avatarPointerHighlighted = false
      }
    } else if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false
      this.emit('hidePointer')
    }
  }

  /**
   * The onMouseLeave method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseLeave(event) {
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onMouseLeave && tool.onMouseLeave(event) == true) break
    }
    if (this.avatarPointerVisible) {
      this.avatarPointerVisible = false
      this.emit('hidePointer')
    }
  }

  /**
   * The onDoubleClick method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onDoubleClick(event) {
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onDoubleClick(event) == true) break
    }
  }

  /**
   * The onWheel method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onWheel(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onWheel(event) == true) break
    }
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   *
   * @param {string} key - The event param.
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyPressed(key, event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onKeyPressed(event, event, viewport) == true) break
    }
  }

  /**
   * The onKeyDown method.
   *
   * @param {string} key - The event param.
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyDown(key, event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onKeyDown(key, event) == true) break
    }
  }

  /**
   * The onKeyUp method.
   *
   * @param {string} key - The event param.
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyUp(key, event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onKeyUp(key, event) == true) break
    }
  }

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchStart(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onTouchStart(event) == true) break
    }
  }

  /**
   * The onTouchMove method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchMove(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onTouchMove(event) == true) break
    }
  }

  /**
   * The onTouchEnd method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchEnd(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onTouchEnd(event) == true) break
    }
  }

  /**
   * The onTouchCancel method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchCancel(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onTouchCancel(event) == true) break
    }
  }

  /**
   * The onDoubleTap method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onDoubleTap(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onDoubleTap(event) == true) break
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The __prepareEvent method.
   * @param {object} event - The event that occurs.
   * @private
   */
  __prepareEvent(event) {
    event.undoRedoManager = this.appData.undoRedoManager
    event.propagating = true
    event.stopPropagation = () => {
      event.propagating = false
    }
  }

  /**
   * The onVRControllerButtonDown method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonDown(event) {
    this.__prepareEvent(event)
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onVRControllerButtonDown(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRControllerButtonUp method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonUp(event) {
    this.__prepareEvent(event)
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onVRControllerButtonUp(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRControllerDoubleClicked method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    this.__prepareEvent(event)
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onVRControllerDoubleClicked(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   */
  onVRPoseChanged(event) {
    this.__prepareEvent(event)
    let i = this.__toolStack.length
    while (i--) {
      const tool = this.__toolStack[i]
      if (tool && tool.onVRPoseChanged(event) == true) break
      if (!event.propagating) break
    }
  }

  /**
   * The destroy method.
   */
  destroy() {
    const viewport = this.appData.renderer.getViewport()

    viewport.removeListenerById('mouseDown', this.mouseDownId)
    viewport.removeListenerById('mouseMove', this.mouseMoveId)
    viewport.removeListenerById('mouseUp', this.mouseUpId)
    viewport.removeListenerById('mouseLeave', this.mouseUpId)
    viewport.removeListenerById('mouseWheel', this.mouseWheelId)

    // ///////////////////////////////////
    // Keyboard events
    viewport.removeListenerById('keyDown', this.keyDownId)
    viewport.removeListenerById('keyUp', this.keyUpId)
    viewport.removeListenerById('keyPressed', this.keyPressedId)

    // ///////////////////////////////////
    // Touch events
    viewport.removeListenerById('touchStart', this.touchStartId)
    viewport.removeListenerById('touchMove', this.touchMoveId)
    viewport.removeListenerById('touchEnd', this.touchEndId)
    viewport.removeListenerById('touchCancel', this.touchCancelId)

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // ///////////////////////////////////
      // VRController events
      viewport.removeListenerById('controllerDown', this.controllerDownId)
      viewport.removeListenerById('controllerUp', this.controllerUpId)
      viewport.removeListenerById('viewChanged', this.onVRPoseChangedId)
    })
  }
}

export { ToolManager }
