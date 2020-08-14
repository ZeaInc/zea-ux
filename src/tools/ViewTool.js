import {
  SystemDesc,
  Vec2,
  Vec3,
  Quat,
  Color,
  Xfo,
  NumberParameter,
  GeomItem,
  Material,
  Sphere,
} from '@zeainc/zea-engine'
import BaseTool from './BaseTool'

const VIEW_TOOL_MODELS = {
  VIEWER: 0,
  DCC: 1,
}

/**
 * Class representing a view tool
 *
 * @extends BaseTool
 */
class ViewTool extends BaseTool {
  /**
   * Creates an instance of ViewTool.
   * @param {object} appData - The appData value.
   * @param {number} [manipulationModel=VIEW_TOOL_MODELS.VIEWER] - The manipulationModel value
   */
  constructor(appData, manipulationModel = VIEW_TOOL_MODELS.VIEWER) {
    super(appData)
    console.log('ViewTool:', manipulationModel)

    this.__manipulationModel = manipulationModel
    this.__defaultMode = 'orbit'
    this.__mode = this.__defaultMode

    this.__mouseDragDelta = new Vec2()
    this.__keyboardMovement = false
    this.__keysPressed = []
    this.__maxVel = 0.002
    this.__velocity = new Vec3()

    this.__ongoingTouches = {}

    this.__orbitRateParam = this.addParameter(new NumberParameter('orbitRate', 1))
    this.__dollySpeedParam = this.addParameter(new NumberParameter('dollySpeed', 0.02))
    this.__mouseWheelDollySpeedParam = this.addParameter(new NumberParameter('mouseWheelDollySpeed', 0.002))

    this.__controllerTriggersHeld = []
  }

  // /////////////////////////////////////
  //

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()
    console.log('activateTool.ViewTool')

    this.appData.renderer.getDiv().style.cursor = 'default'

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Sphere(0.02 * 0.75)
        this.vrControllerToolTipMat = new Material('Cross', 'FlatSurfaceShader')
        this.vrControllerToolTipMat.getParameter('BaseColor').setValue(new Color('#03E3AC'))
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false
      }
      const addIconToController = (controller) => {
        const geomItem = new GeomItem('HandleToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat)
        controller.getTipItem().removeAllChildren()
        controller.getTipItem().addChild(geomItem, false)
      }
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = xrvp.on('controllerAdded', addIconToController)
    })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool()

    this.appData.renderer.getXRViewport().then((xrvp) => {
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId)
    })
  }

  // /////////////////////////////////////
  //

  /**
   * The setDefaultMode method.
   * @param {string} mode - The mode param.
   */
  setDefaultMode(mode) {
    this.__defaultMode = mode
  }

  /**
   * The look method.
   * @param {Vec2} dragVec - The dragVec param.
   * @param {GLViewport} viewport - The viewport param.
   */
  look(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance()
    const orbitRate = this.__orbitRateParam.getValue() * SystemDesc.isMobileDevice ? -1 : 1

    if (this.__keyboardMovement) {
      const globalXfo = viewport.getCamera().getParameter('GlobalXfo').getValue()
      this.__mouseDownCameraXfo = globalXfo.clone()
      this.__mouseDownZaxis = globalXfo.ori.getZaxis()
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance)
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset)
    }

    const globalXfo = this.__mouseDownCameraXfo.clone()

    // Orbit
    const orbit = new Quat()
    orbit.rotateZ((dragVec.x / viewport.getWidth()) * Math.PI * orbitRate)
    globalXfo.ori = orbit.multiply(globalXfo.ori)

    // Pitch
    const pitch = new Quat()
    pitch.rotateX((dragVec.y / viewport.getHeight()) * Math.PI * orbitRate)
    globalXfo.ori.multiplyInPlace(pitch)

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo)
    } else {
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo)
    }
  }

  /**
   * The orbit method.
   * @param {Vec2} dragVec - The dragVec param.
   * @param {GLViewport} viewport - The viewport param.
   */
  orbit(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance()
    const orbitRate = this.__orbitRateParam.getValue() * SystemDesc.isMobileDevice ? -1 : 1

    if (this.__keyboardMovement) {
      const globalXfo = viewport.getCamera().getParameter('GlobalXfo').getValue()
      this.__mouseDownCameraXfo = globalXfo.clone()
      this.__mouseDownZaxis = globalXfo.ori.getZaxis()
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance)
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset)
    }

    const globalXfo = this.__mouseDownCameraXfo.clone()

    // Orbit
    const orbit = new Quat()
    orbit.rotateZ((dragVec.x / viewport.getWidth()) * 2 * Math.PI * -orbitRate)
    globalXfo.ori = orbit.multiply(globalXfo.ori)

    // Pitch
    const pitch = new Quat()
    pitch.rotateX((dragVec.y / viewport.getHeight()) * Math.PI * -orbitRate)
    globalXfo.ori.multiplyInPlace(pitch)

    globalXfo.tr = this.__mouseDownCameraTarget.add(globalXfo.ori.getZaxis().scale(focalDistance))

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo)
    } else {
      viewport.getCamera().getParameter('GlobalXfo').setValue(globalXfo)
    }
  }

  /**
   * The pan method.
   *
   * @param {Vec2} dragVec - The dragVec param.
   * @param {GLViewport} viewport - The viewport param.
   */
  pan(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance()
    const fovY = viewport.getCamera().getFov()
    const xAxis = new Vec3(1, 0, 0)
    const yAxis = new Vec3(0, 1, 0)

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY)
    const cameraPlaneWidth = cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight())
    const delta = new Xfo()
    delta.tr = xAxis.scale(-(dragVec.x / viewport.getWidth()) * cameraPlaneWidth)
    delta.tr.addInPlace(yAxis.scale((dragVec.y / viewport.getHeight()) * cameraPlaneHeight))

    viewport.getCamera().getParameter('GlobalXfo').setValue(this.__mouseDownCameraXfo.multiply(delta))
  }

  /**
   * The dolly method.
   *
   * @param {Vec2} dragVec - The dragVec param.
   * @param {GLViewport} viewport - The viewport param.
   */
  dolly(dragVec, viewport) {
    const dollyDist = dragVec.x * this.__dollySpeedParam.getValue()
    const delta = new Xfo()
    delta.tr.set(0, 0, dollyDist)
    viewport.getCamera().getParameter('GlobalXfo').setValue(this.__mouseDownCameraXfo.multiply(delta))
  }

  /**
   * The panAndZoom method.
   *
   * @param {Vec2} panDelta - The panDelta param.
   * @param {number} dragDist - The dragDist param.
   * @param {GLViewport} viewport - The viewport param.
   */
  panAndZoom(panDelta, dragDist, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance()
    const fovY = viewport.getCamera().getFov()

    const xAxis = new Vec3(1, 0, 0)
    const yAxis = new Vec3(0, 1, 0)

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY)
    const cameraPlaneWidth = cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight())
    const delta = new Xfo()
    delta.tr = xAxis.scale(-(panDelta.x / viewport.getWidth()) * cameraPlaneWidth)
    delta.tr.addInPlace(yAxis.scale((panDelta.y / viewport.getHeight()) * cameraPlaneHeight))

    const zoomDist = dragDist * focalDistance
    viewport.getCamera().setFocalDistance(this.__mouseDownFocalDist + zoomDist)
    delta.tr.z += zoomDist
    viewport.getCamera().getParameter('GlobalXfo').setValue(this.__mouseDownCameraXfo.multiply(delta))
  }

  /**
   * The initDrag method.
   *
   * @param {GLViewport} viewport - The viewport param.
   */
  initDrag(viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance()
    this.__mouseDragDelta.set(0, 0)
    this.__mouseDownCameraXfo = viewport.getCamera().getParameter('GlobalXfo').getValue().clone()
    this.__mouseDownZaxis = viewport.getCamera().getParameter('GlobalXfo').getValue().ori.getZaxis()
    const targetOffset = this.__mouseDownZaxis.scale(-focalDistance)
    this.__mouseDownCameraTarget = viewport.getCamera().getParameter('GlobalXfo').getValue().tr.add(targetOffset)
    this.__mouseDownFocalDist = focalDistance
  }

  /**
   * The aimFocus method.
   * @param {Camera} camera - The camera param.
   * @param {Vec3} pos - The pos param.
   */
  aimFocus(camera, pos) {
    if (this.__focusIntervalId) clearInterval(this.__focusIntervalId)

    const count = 20
    let i = 0
    const applyMovement = () => {
      const initlalGlobalXfo = camera.getParameter('GlobalXfo').getValue()
      const initlalDist = camera.getFocalDistance()
      const dir = pos.subtract(initlalGlobalXfo.tr)
      const dist = dir.normalizeInPlace()

      const orbit = new Quat()
      const pitch = new Quat()

      // Orbit
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone()
        currDir.z = 0
        const newDir = dir.negate()
        newDir.z = 0

        orbit.setFrom2Vectors(currDir, newDir)
      }

      // Pitch
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone()
        const newDir = dir.negate()
        currDir.x = newDir.x
        currDir.y = newDir.y
        currDir.normalizeInPlace()

        if (currDir.cross(newDir).dot(initlalGlobalXfo.ori.getXaxis()) > 0.0) pitch.rotateX(currDir.angleTo(newDir))
        else pitch.rotateX(-currDir.angleTo(newDir))
      }

      const targetGlobalXfo = initlalGlobalXfo.clone()
      targetGlobalXfo.ori = orbit.multiply(targetGlobalXfo.ori)
      targetGlobalXfo.ori.multiplyInPlace(pitch)

      // With each iteraction we get closer to our goal
      // and on the final iteration we should aim perfectly at
      // the target.
      const t = Math.pow(i / count, 2)
      const globalXfo = initlalGlobalXfo.clone()
      globalXfo.ori = initlalGlobalXfo.ori.lerp(targetGlobalXfo.ori, t)

      camera.setFocalDistance(initlalDist + (dist - initlalDist) * t)
      camera.getParameter('GlobalXfo').setValue(globalXfo)

      i++
      if (i <= count) {
        this.__focusIntervalId = setTimeout(applyMovement, 20)
      } else {
        this.__focusIntervalId = undefined
        this.emit('movementFinished')
      }
    }
    applyMovement()

    this.__manipulationState = 'focussing'
  }

  /**
   * The onDragStart method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onDragStart(event) {
    this.__mouseDownPos = event.mousePos
    this.initDrag(event.viewport)

    if (event.button == 2) {
      this.__mode = 'pan'
    } else if (event.ctrlKey && event.button == 2) {
      this.__mode = 'dolly'
    } else if (event.shiftKey || event.button == 2) {
      this.__mode = 'look'
    } else {
      this.__mode = this.__defaultMode
    }
  }

  /**
   * The onDrag method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onDrag(event) {
    // During requestPointerLock, the offsetX/Y values are not updated.
    // Instead we get a relative delta that we use to compute the total
    // delta for the drag.
    // if(this.__keyboardMovement){
    //     this.__mouseDragDelta.x = event.movementX;
    //     this.__mouseDragDelta.y = event.movementY;
    // }
    // else{
    //     this.__mouseDragDelta.x += event.movementX;
    //     this.__mouseDragDelta.y += event.movementY;
    // }
    if (this.__keyboardMovement) {
      this.__mouseDragDelta = event.mousePos
    } else {
      this.__mouseDragDelta = event.mousePos.subtract(this.__mouseDownPos)
    }
    switch (this.__mode) {
      case 'orbit':
        this.orbit(this.__mouseDragDelta, event.viewport)
        break
      case 'look':
        this.look(this.__mouseDragDelta, event.viewport)
        break
      case 'pan':
        this.pan(this.__mouseDragDelta, event.viewport)
        break
      case 'dolly':
        this.dolly(this.__mouseDragDelta, event.viewport)
        break
    }
  }

  /**
   * The onDragEnd method.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onDragEnd(event) {
    // event.viewport.renderGeomDataFbo();
    this.emit('movementFinished')
    return false
  }

  /**
   * The onMouseDown method.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseDown(event) {
    if (this.__manipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey) return false

    this.dragging = true
    this.__mouseDownPos = event.mousePos
    this.onDragStart(event)
    return true
  }

  /**
   * The onMouseUp method.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseUp(event) {
    if (this.dragging) {
      this.onDragEnd(event)
      this.dragging = false
      return true
    }
  }

  /**
   * The onMouseMove method.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onMouseMove(event) {
    if (this.dragging) {
      this.onDrag(event)
      event.showPointerOnAvatar = false
      return true
    }
  }

  /**
   * The onDoubleClick method.
   *
   * @param {MouseEvent} event - The event param.
   */
  onDoubleClick(event) {
    if (event.intersectionData) {
      const viewport = event.viewport
      const camera = viewport.getCamera()
      const pos = camera
        .getParameter('GlobalXfo')
        .getValue()
        .tr.add(event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist))
      this.aimFocus(camera, pos)
    }
  }

  /**
   * The onWheel method.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onWheel(event) {
    if (this.__manipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey) return false

    const viewport = event.viewport
    const xfo = viewport.getCamera().getParameter('GlobalXfo').getValue()
    const vec = xfo.ori.getZaxis()
    if (this.__mouseWheelZoomIntervalId) clearInterval(this.__mouseWheelZoomIntervalId)
    let count = 0
    const applyMovement = () => {
      const focalDistance = viewport.getCamera().getFocalDistance()
      const mouseWheelDollySpeed = this.__mouseWheelDollySpeedParam.getValue()
      const zoomDist = event.deltaY * mouseWheelDollySpeed * focalDistance * 0.2
      xfo.tr.addInPlace(vec.scale(zoomDist))
      if (this.__defaultMode == 'orbit') viewport.getCamera().setFocalDistance(focalDistance + zoomDist)
      viewport.getCamera().getParameter('GlobalXfo').setValue(xfo)

      count++
      if (count < 5) {
        this.__mouseWheelZoomIntervalId = setTimeout(applyMovement, 20)
      } else {
        this.__mouseWheelZoomIntervalId = undefined
        this.emit('movementFinished')
        event.viewport.renderGeomDataFbo()
      }
    }
    applyMovement()
  }

  /**
   *
   *
   * @param {*} velChange -
   * @param {GLViewport} viewport -
   * @private
   */
  __integrateVelocityChange(velChange, viewport) {
    const delta = new Xfo()
    delta.tr = this.__velocity.normalize().scale(this.__maxVel)
    viewport
      .getCamera()
      .getParameter('GlobalXfo')
      .setValue(viewport.getCamera().getParameter('GlobalXfo').getValue().multiply(delta))
  }

  // ///////////////////////////////////
  // Touch events

  /**
   *
   *
   * @param {*} touch -
   * @param {*} viewport -
   * @private
   */
  __startTouch(touch, viewport) {
    this.__ongoingTouches[touch.identifier] = {
      identifier: touch.identifier,
      pos: new Vec2(touch.pageX, touch.pageY),
    }
  }

  /**
   *
   *
   * @param {*} touch -
   * @param {*} viewport -
   * @private
   */
  __endTouch(touch, viewport) {
    // const idx = this.__ongoingTouchIndexById(touch.identifier);
    // this.__ongoingTouches.splice(idx, 1); // remove it; we're done
    delete this.__ongoingTouches[touch.identifier]
  }

  /**
   * The onTouchStart method.
   *
   * @param {TouchEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  onTouchStart(event) {
    // console.log("onTouchStart");
    event.preventDefault()
    event.stopPropagation()

    if (Object.keys(this.__ongoingTouches).length == 0) this.__manipMode = undefined

    const touches = event.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i])
    }
    this.initDrag(event.viewport)
    return true
  }

  /**
   * The onTouchMove method.
   *
   * @param {TouchEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onTouchMove(event) {
    event.preventDefault()
    event.stopPropagation()
    // console.log("this.__manipMode:" + this.__manipMode);

    const touches = event.changedTouches
    if (touches.length == 1 && this.__manipMode != 'panAndZoom') {
      const touch = touches[0]
      const touchPos = new Vec2(touch.pageX, touch.pageY)
      const touchData = this.__ongoingTouches[touch.identifier]
      const dragVec = touchData.pos.subtract(touchPos)
      if (this.__defaultMode == 'look') {
        // TODO: scale panning here.
        dragVec.scaleInPlace(6.0)
        this.look(dragVec, event.viewport)
      } else {
        this.orbit(dragVec, event.viewport)
      }
      this.__manipMode = 'orbit'
      return true
    } else if (touches.length == 2) {
      const touch0 = touches[0]
      const touchData0 = this.__ongoingTouches[touch0.identifier]
      const touch1 = touches[1]
      const touchData1 = this.__ongoingTouches[touch1.identifier]

      const touch0Pos = new Vec2(touch0.pageX, touch0.pageY)
      const touch1Pos = new Vec2(touch1.pageX, touch1.pageY)
      const startSeparation = touchData1.pos.subtract(touchData0.pos).length()
      const dragSeparation = touch1Pos.subtract(touch0Pos).length()
      const separationDist = startSeparation - dragSeparation

      const touch0Drag = touch0Pos.subtract(touchData0.pos)
      const touch1Drag = touch1Pos.subtract(touchData1.pos)
      const dragVec = touch0Drag.add(touch1Drag)
      // TODO: scale panning here.
      dragVec.scaleInPlace(0.5)
      this.panAndZoom(dragVec, separationDist * 0.002, event.viewport)
      this.__manipMode = 'panAndZoom'
      return true
    }
  }

  /**
   * The onTouchEnd method.
   *
   * @param {TouchEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  onTouchEnd(event) {
    event.preventDefault()
    event.stopPropagation()
    const touches = event.changedTouches
    switch (this.__manipMode) {
      case 'orbit':
      case 'panAndZoom':
        this.emit('movementFinished')
        break
    }
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i])
    }
    if (Object.keys(this.__ongoingTouches).length == 0) this.__manipMode = undefined
    return true
  }

  /**
   * The onTouchCancel method.
   *
   * @param {TouchEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  onTouchCancel(event) {
    console.log('touchcancel.')
    const touches = event.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i])
    }
    return true
  }

  /**
   * The onDoubleTap method.
   *
   * @param {TouchEvent} event - The event param.
   */
  onDoubleTap(event) {
    const touches = event.changedTouches
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i])
    }
    if (event.intersectionData) {
      const viewport = event.viewport
      const camera = viewport.getCamera()
      const pos = camera
        .getParameter('GlobalXfo')
        .getValue()
        .tr.add(event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist))
      this.aimFocus(camera, pos)
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   *
   *
   * @param {VRViewport} vrviewport
   * @private
   */
  __initMoveStage(vrviewport) {
    if (this.__controllerTriggersHeld.length == 1) {
      this.__grabPos = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo().tr.clone()
      this.stageXfo__GrabStart = vrviewport.getXfo().clone()
      this.__invOri = this.stageXfo__GrabStart.ori.inverse()
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo().tr
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo().tr
      this.__grabDir = p1.subtract(p0)
      this.__grabPos = p0.lerp(p1, 0.5)
      this.__grabDir.y = 0.0
      this.__grabDist = this.__grabDir.length()
      this.__grabDir.scaleInPlace(1 / this.__grabDist)
      this.stageXfo__GrabStart = vrviewport.getXfo().clone()
      this.__grab_to_stage = this.__grabPos.subtract(this.stageXfo__GrabStart.tr)
    }
  }

  /**
   * The onVRControllerButtonDown method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.button != 1) return
    this.__controllerTriggersHeld.push(event.controller)
    this.__initMoveStage(event.vrviewport)
    return true
  }

  /**
   * The onVRControllerButtonUp method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonUp(event) {
    if (event.button != 1) return
    const index = this.__controllerTriggersHeld.indexOf(event.controller)
    this.__controllerTriggersHeld.splice(index, 1)
    this.__initMoveStage(event.vrviewport)
    return true
  }

  /**
   * The onVRControllerDoubleClicked method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    console.log('onVRControllerDoubleClicked:', this.__controllerTriggersHeld.length)

    const stageXfo = event.vrviewport.getXfo().clone()
    stageXfo.sc.set(1, 1, 1)
    event.vrviewport.setXfo(stageXfo)
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__controllerTriggersHeld.length == 1) {
      const grabPos = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo().tr

      const deltaXfo = new Xfo()
      deltaXfo.tr = this.__grabPos.subtract(grabPos)

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo)
      event.vrviewport.setXfo(stageXfo)
      return true
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo().tr
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo().tr

      const grabPos = p0.lerp(p1, 0.5)
      const grabDir = p1.subtract(p0)
      grabDir.y = 0.0
      const grabDist = grabDir.length()
      grabDir.scaleInPlace(1 / grabDist)

      const deltaXfo = new Xfo()

      // //////////////
      // Compute sc
      // Limit to a 10x change in scale per grab.
      const sc = Math.max(Math.min(this.__grabDist / grabDist, 10.0), 0.1)

      // Avoid causing a scale that would make the user < 1.0 scale factor.
      // if(stageSc < 1.0){
      //     sc = 1.0 / this.stageXfo__GrabStart.sc.x;
      // }
      deltaXfo.sc.set(sc, sc, sc)

      // //////////////
      // Compute ori
      let angle = this.__grabDir.angleTo(grabDir)
      if (this.__grabDir.cross(grabDir).y > 0.0) {
        angle = -angle
      }
      deltaXfo.ori.rotateY(angle)

      // Rotate around the point between the hands.
      const oriTrDelta = deltaXfo.ori.rotateVec3(this.__grabPos)
      deltaXfo.tr.addInPlace(this.__grabPos.subtract(oriTrDelta))

      // Scale around the point between the hands.
      const deltaSc = this.__grabPos.scale(1.0 - sc)
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaSc))

      // //////////////
      // Compute tr
      // Not quite working.....
      const deltaTr = this.__grabPos.subtract(grabPos).scale(sc)
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaTr))

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo)
      event.vrviewport.setXfo(stageXfo)

      return true
    }
  }
}

export { VIEW_TOOL_MODELS, ViewTool }
