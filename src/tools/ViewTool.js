import BaseTool from './BaseTool.js';

const VIEW_TOOL_MODELS = {
  VIEWER: 0,
  DCC: 1,
};

/**
 * Class representing a view tool
 * @extends BaseTool
 */
class ViewTool extends BaseTool {
  /**
   * Create an axial rotation scene widget.
   * @param {any} appData - The appData value.
   * @param {any} maipulationModel - The maipulationModel value.
   */
  constructor(appData, maipulationModel = VIEW_TOOL_MODELS.VIEWER) {
    super(appData);
    console.log('ViewTool:', maipulationModel);

    this.__maipulationModel = maipulationModel;
    this.__defaultMode = 'orbit';
    this.__mode = this.__defaultMode;

    this.__mouseDragDelta = new Visualive.Vec2();
    this.__keyboardMovement = false;
    this.__keysPressed = [];
    this.__maxVel = 0.002;
    this.__velocity = new Visualive.Vec3();

    this.__ongoingTouches = {};

    this.__orbitRateParam = this.addParameter(
      new Visualive.NumberParameter(
        'orbitRate',
        Visualive.SystemDesc.isMobileDevice ? -0.003 : 0.01
      )
    );
    this.__dollySpeedParam = this.addParameter(
      new Visualive.NumberParameter('dollySpeed', 0.02)
    );
    this.__mouseWheelDollySpeedParam = this.addParameter(
      new Visualive.NumberParameter('mouseWheelDollySpeed', 0.002)
    );

    this.__controllerTriggersHeld = [];

    this.movementFinished = new Visualive.Signal();
  }

  // /////////////////////////////////////
  //

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool();
    console.log('activateTool.ViewTool');

    this.appData.renderer.getDiv().style.cursor = 'default';

    this.appData.renderer.getXRViewport().then(xrvp => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Visualive.Sphere(0.02 * 0.75);
        this.vrControllerToolTipMat = new Visualive.Material(
          'Cross',
          'FlatSurfaceShader'
        );
        this.vrControllerToolTipMat
          .getParameter('BaseColor')
          .setValue(new Visualive.Color('#03E3AC'));
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false;
      }
      const addIconToController = controller => {
        const geomItem = new Visualive.GeomItem(
          'SceneWidgetToolTip',
          this.vrControllerToolTip,
          this.vrControllerToolTipMat
        );
        controller.getTipItem().removeAllChildren();
        controller.getTipItem().addChild(geomItem, false);
      };
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller);
      }
      this.addIconToControllerId = xrvp.controllerAdded.connect(
        addIconToController
      );
    });
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getXRViewport().then(xrvp => {
      // if(this.vrControllerToolTip) {
      //   // for(let controller of xrvp.getControllers()) {
      //   //   controller.getTipItem().removeAllChildren();
      //   // }
      // }
      xrvp.controllerAdded.disconnectId(this.addIconToControllerId);
    });
  }

  // /////////////////////////////////////
  //

  /**
   * The setDefaultMode method.
   * @param {any} mode - The mode param.
   */
  setDefaultMode(mode) {
    this.__defaultMode = mode;
  }

  /**
   * The look method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  look(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const orbitRate = this.__orbitRateParam.getValue();

    if (this.__keyboardMovement) {
      const globalXfo = viewport.getCamera().getGlobalXfo();
      this.__mouseDownCameraXfo = globalXfo.clone();
      this.__mouseDownZaxis = globalXfo.ori.getZaxis();
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset);
    }

    const globalXfo = this.__mouseDownCameraXfo.clone();

    // Orbit
    const orbit = new Visualive.Quat();
    orbit.rotateZ(dragVec.x * orbitRate * 0.12);
    // globalXfo.ori.multiplyInPlace(orbit);
    globalXfo.ori = orbit.multiply(globalXfo.ori);

    // Pitch
    const pitch = new Visualive.Quat();
    pitch.rotateX(dragVec.y * orbitRate * 0.12);
    globalXfo.ori.multiplyInPlace(pitch);

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().setGlobalXfo(globalXfo);
    } else {
      viewport.getCamera().setGlobalXfo(globalXfo);
    }
  }

  /**
   * The orbit method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  orbit(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const orbitRate = this.__orbitRateParam.getValue();

    if (this.__keyboardMovement) {
      const globalXfo = viewport.getCamera().getGlobalXfo();
      this.__mouseDownCameraXfo = globalXfo.clone();
      this.__mouseDownZaxis = globalXfo.ori.getZaxis();
      const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
      this.__mouseDownCameraTarget = globalXfo.tr.add(targetOffset);
    }

    const globalXfo = this.__mouseDownCameraXfo.clone();

    // Orbit
    const orbit = new Visualive.Quat();
    orbit.rotateZ(dragVec.x * -orbitRate);
    // globalXfo.ori.multiplyInPlace(orbit);
    globalXfo.ori = orbit.multiply(globalXfo.ori);

    // Pitch
    const pitch = new Visualive.Quat();
    pitch.rotateX(dragVec.y * -orbitRate);
    globalXfo.ori.multiplyInPlace(pitch);

    globalXfo.tr = this.__mouseDownCameraTarget.add(
      globalXfo.ori.getZaxis().scale(focalDistance)
    );

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().setGlobalXfo(globalXfo);
    } else {
      viewport.getCamera().setGlobalXfo(globalXfo);
    }
  }

  /**
   * The pan method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  pan(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();
    const xAxis = new Visualive.Vec3(1, 0, 0);
    const yAxis = new Visualive.Vec3(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth =
      cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Visualive.Xfo();
    delta.tr = xAxis.scale(
      -(dragVec.x / viewport.getWidth()) * cameraPlaneWidth
    );
    delta.tr.addInPlace(
      yAxis.scale((dragVec.y / viewport.getHeight()) * cameraPlaneHeight)
    );

    viewport
      .getCamera()
      .setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The dolly method.
   * @param {any} dragVec - The dragVec param.
   * @param {any} viewport - The viewport param.
   */
  dolly(dragVec, viewport) {
    const dollyDist = dragVec.x * this.__dollySpeedParam.getValue();
    const delta = new Visualive.Xfo();
    delta.tr.set(0, 0, dollyDist);
    viewport
      .getCamera()
      .setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The panAndZoom method.
   * @param {any} panDelta - The panDelta param.
   * @param {any} dragDist - The dragDist param.
   * @param {any} viewport - The viewport param.
   */
  panAndZoom(panDelta, dragDist, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();

    const xAxis = new Visualive.Vec3(1, 0, 0);
    const yAxis = new Visualive.Vec3(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth =
      cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Visualive.Xfo();
    delta.tr = xAxis.scale(
      -(panDelta.x / viewport.getWidth()) * cameraPlaneWidth
    );
    delta.tr.addInPlace(
      yAxis.scale((panDelta.y / viewport.getHeight()) * cameraPlaneHeight)
    );

    const zoomDist = dragDist * focalDistance;
    viewport.getCamera().setFocalDistance(this.__mouseDownFocalDist + zoomDist);
    delta.tr.z += zoomDist;
    viewport
      .getCamera()
      .setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  /**
   * The initDrag method.
   * @param {any} viewport - The viewport param.
   */
  initDrag(viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    this.__mouseDragDelta.set(0, 0);
    this.__mouseDownCameraXfo = viewport
      .getCamera()
      .getGlobalXfo()
      .clone();
    this.__mouseDownZaxis = viewport
      .getCamera()
      .getGlobalXfo()
      .ori.getZaxis();
    const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
    this.__mouseDownCameraTarget = viewport
      .getCamera()
      .getGlobalXfo()
      .tr.add(targetOffset);
    this.__mouseDownFocalDist = focalDistance;
  }

  /**
   * The aimFocus method.
   * @param {any} camera - The camera param.
   * @param {any} pos - The pos param.
   */
  aimFocus(camera, pos) {
    if (this.__focusIntervalId) clearInterval(this.__focusIntervalId);

    const count = 20;
    let i = 0;
    const applyMovement = () => {
      const initlalGlobalXfo = camera.getGlobalXfo();
      const initlalDist = camera.getFocalDistance();
      const dir = pos.subtract(initlalGlobalXfo.tr);
      const dist = dir.normalizeInPlace();

      const orbit = new Visualive.Quat();
      const pitch = new Visualive.Quat();

      // Orbit
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone();
        currDir.z = 0;
        const newDir = dir.negate();
        newDir.z = 0;

        orbit.setFrom2Vectors(currDir, newDir);
      }

      // Pitch
      {
        const currDir = initlalGlobalXfo.ori.getZaxis().clone();
        const newDir = dir.negate();
        currDir.x = newDir.x;
        currDir.y = newDir.y;
        currDir.normalizeInPlace();

        if (currDir.cross(newDir).dot(initlalGlobalXfo.ori.getXaxis()) > 0.0)
          pitch.rotateX(currDir.angleTo(newDir));
        else pitch.rotateX(-currDir.angleTo(newDir));
      }

      const targetGlobalXfo = initlalGlobalXfo.clone();
      targetGlobalXfo.ori = orbit.multiply(targetGlobalXfo.ori);
      targetGlobalXfo.ori.multiplyInPlace(pitch);

      // With each iteraction we get closer to our goal
      // and on the final iteration we should aim perfectly at
      // the target.
      const t = Math.pow(i / count, 2);
      const globalXfo = initlalGlobalXfo.clone();
      globalXfo.ori = initlalGlobalXfo.ori.lerp(targetGlobalXfo.ori, t);

      camera.setFocalDistance(initlalDist + (dist - initlalDist) * t);
      camera.setGlobalXfo(globalXfo);

      i++;
      if (i <= count) {
        this.__focusIntervalId = setTimeout(applyMovement, 20);
      } else {
        this.__focusIntervalId = undefined;
        this.movementFinished.emit();
      }
    };
    applyMovement();

    this.__manipulationState = 'focussing';
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   */
  onMouseMove(event) {}

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.__mouseDownPos = event.mousePos;
    this.initDrag(event.viewport);

    if (event.button == 2) {
      this.__mode = 'pan';
    } else if (event.ctrlKey && event.button == 2) {
      this.__mode = 'dolly';
    } /* else if (event.ctrlKey || event.button == 2) {
      this.__mode = 'look';
    }*/ else {
      this.__mode = this.__defaultMode;
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
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
      this.__mouseDragDelta = event.mousePos;
    } else {
      this.__mouseDragDelta = event.mousePos.subtract(this.__mouseDownPos);
    }
    switch (this.__mode) {
      case 'orbit':
        this.orbit(this.__mouseDragDelta, event.viewport);
        break;
      case 'look':
        this.look(this.__mouseDragDelta, event.viewport);
        break;
      case 'pan':
        this.pan(this.__mouseDragDelta, event.viewport);
        break;
      case 'dolly':
        this.dolly(this.__mouseDragDelta, event.viewport);
        break;
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onDragEnd(event) {
    // event.viewport.renderGeomDataFbo();
    this.movementFinished.emit();
    return false;
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    if (this.__maipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey)
      return false;

    this.dragging = true;
    this.__mouseDownPos = event.mousePos;
    this.onDragStart(event);
    return true;
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseUp(event) {
    if (this.dragging) {
      this.onDragEnd(event);
      this.dragging = false;
      return true;
    }
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.dragging) {
      this.onDrag(event);
      event.showPointerOnAvatar = false;
      return true;
    }
  }

  /**
   * The onDoubleClick method.
   * @param {any} event - The event param.
   */
  onDoubleClick(event) {
    if (event.intersectionData) {
      const viewport = event.viewport;
      const camera = viewport.getCamera();
      const pos = camera
        .getGlobalXfo()
        .tr.add(
          event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist)
        );
      this.aimFocus(camera, pos);
    }
  }

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onWheel(event) {
    if (this.__maipulationModel == VIEW_TOOL_MODELS.DCC && !event.altKey)
      return false;

    const viewport = event.viewport;
    const xfo = viewport.getCamera().getGlobalXfo();
    const vec = xfo.ori.getZaxis();
    if (this.__mouseWheelZoomIntervalId)
      clearInterval(this.__mouseWheelZoomIntervalId);
    let count = 0;
    const applyMovement = () => {
      const focalDistance = viewport.getCamera().getFocalDistance();
      const mouseWheelDollySpeed = this.__mouseWheelDollySpeedParam.getValue();
      const zoomDist =
        event.deltaY * mouseWheelDollySpeed * focalDistance * 0.2;
      xfo.tr.addInPlace(vec.scale(zoomDist));
      if (this.__defaultMode == 'orbit')
        viewport.getCamera().setFocalDistance(focalDistance + zoomDist);
      viewport.getCamera().setGlobalXfo(xfo);

      count++;
      if (count < 5) {
        this.__mouseWheelZoomIntervalId = setTimeout(applyMovement, 20);
      } else {
        this.__mouseWheelZoomIntervalId = undefined;
        this.movementFinished.emit();
        event.viewport.renderGeomDataFbo();
      }
    };
    applyMovement();
  }

  // eslint-disable-next-line require-jsdoc
  __integrateVelocityChange(velChange, viewport) {
    const delta = new Visualive.Xfo();
    delta.tr = this.__velocity.normalize().scale(this.__maxVel);
    viewport.getCamera().setGlobalXfo(
      viewport
        .getCamera()
        .getGlobalXfo()
        .multiply(delta)
    );
  }

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onKeyPressed(key, event) {
    // Note: onKeyPressed is called intiallly only once, and then we
    // get a series of calls. Here we ignore subsequent events.
    // (TODO: move this logic to a special controller)
    /*
    switch (key) {
      case 'w':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.z -= 1.0;
        break;
      case 's':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.z += 1.0;
        break;
      case 'a':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.x -= 1.0;
        break;
      case 'd':
        if (this.__keysPressed.indexOf(key) != -1)
          return false;
        this.__velocity.x += 1.0;
        break;
      default:
        return false;
    }
    this.__keysPressed.push(key);
    if (!this.__keyboardMovement) {
      this.__keyboardMovement = true;
      let animationFrame = ()=>{
        this.__integrateVelocityChange()
        if (this.__keyboardMovement)
          window.requestAnimationFrame(animationFrame);
      }
      window.requestAnimationFrame(animationFrame);
    }
    */
    return false; // no keys handled
  }

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(key, event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onKeyUp(key, event) {
    // (TODO: move this logic to a special controller)
    /*
    switch (key) {
      case 'w':
        this.__velocity.z += 1.0;
        break;
      case 's':
        this.__velocity.z -= 1.0;
        break;
      case 'a':
        this.__velocity.x += 1.0;
        break;
      case 'd':
        this.__velocity.x -= 1.0;
        break;
      default:
        return false;
    }
    let keyIndex = this.__keysPressed.indexOf(key);
    this.__keysPressed.splice(keyIndex, 1);
    if (this.__keysPressed.length == 0)
      this.__keyboardMovement = false;
    */
    return true;
  }

  // ///////////////////////////////////
  // Touch events

  // eslint-disable-next-line require-jsdoc
  __startTouch(touch, viewport) {
    this.__ongoingTouches[touch.identifier] = {
      identifier: touch.identifier,
      pos: new Visualive.Vec2(touch.pageX, touch.pageY),
    };
  }

  // eslint-disable-next-line require-jsdoc
  __endTouch(touch, viewport) {
    // const idx = this.__ongoingTouchIndexById(touch.identifier);
    // this.__ongoingTouches.splice(idx, 1); // remove it; we're done
    delete this.__ongoingTouches[touch.identifier];
  }

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchStart(event) {
    // console.log("onTouchStart");
    event.preventDefault();
    event.stopPropagation();

    if (Object.keys(this.__ongoingTouches).length == 0)
      this.__manipMode = undefined;

    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i]);
    }
    this.initDrag(event.viewport);
    return true;
  }

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log("this.__manipMode:" + this.__manipMode);

    const touches = event.changedTouches;
    if (touches.length == 1 && this.__manipMode != 'panAndZoom') {
      const touch = touches[0];
      const touchPos = new Visualive.Vec2(touch.pageX, touch.pageY);
      const touchData = this.__ongoingTouches[touch.identifier];
      const dragVec = touchData.pos.subtract(touchPos);
      if (this.__defaultMode == 'look') {
        // TODO: scale panning here.
        dragVec.scaleInPlace(6.0);
        this.look(dragVec, event.viewport);
      } else {
        this.orbit(dragVec, event.viewport);
      }
      this.__manipMode = 'orbit';
      return true;
    } else if (touches.length == 2) {
      const touch0 = touches[0];
      const touchData0 = this.__ongoingTouches[touch0.identifier];
      const touch1 = touches[1];
      const touchData1 = this.__ongoingTouches[touch1.identifier];

      const touch0Pos = new Visualive.Vec2(touch0.pageX, touch0.pageY);
      const touch1Pos = new Visualive.Vec2(touch1.pageX, touch1.pageY);
      const startSeparation = touchData1.pos.subtract(touchData0.pos).length();
      const dragSeparation = touch1Pos.subtract(touch0Pos).length();
      const separationDist = startSeparation - dragSeparation;

      const touch0Drag = touch0Pos.subtract(touchData0.pos);
      const touch1Drag = touch1Pos.subtract(touchData1.pos);
      const dragVec = touch0Drag.add(touch1Drag);
      // TODO: scale panning here.
      dragVec.scaleInPlace(0.5);
      this.panAndZoom(dragVec, separationDist * 0.002, event.viewport);
      this.__manipMode = 'panAndZoom';
      return true;
    }
  }

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    const touches = event.changedTouches;
    switch (this.__manipMode) {
      case 'orbit':
      case 'panAndZoom':
        this.movementFinished.emit();
        break;
    }
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    if (Object.keys(this.__ongoingTouches).length == 0)
      this.__manipMode = undefined;
    return true;
  }

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onTouchCancel(event) {
    console.log('touchcancel.');
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    return true;
  }

  /**
   * The onDoubleTap method.
   * @param {any} event - The event param.
   */
  onDoubleTap(event) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i]);
    }
    if (event.intersectionData) {
      const viewport = event.viewport;
      const camera = viewport.getCamera();
      const pos = camera
        .getGlobalXfo()
        .tr.add(
          event.intersectionData.mouseRay.dir.scale(event.intersectionData.dist)
        );
      this.aimFocus(camera, pos);
    }
  }

  // ///////////////////////////////////
  // VRController events

  // eslint-disable-next-line require-jsdoc
  __initMoveStage(vrviewport) {
    if (this.__controllerTriggersHeld.length == 1) {
      this.__grabPos = this.__controllerTriggersHeld[0]
        .getControllerTipStageLocalXfo()
        .tr.clone();
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__invOri = this.stageXfo__GrabStart.ori.inverse();
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo()
        .tr;
      this.__grabDir = p1.subtract(p0);
      this.__grabPos = p0.lerp(p1, 0.5);
      this.__grabDir.y = 0.0;
      this.__grabDist = this.__grabDir.length();
      this.__grabDir.scaleInPlace(1 / this.__grabDist);
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__grab_to_stage = this.__grabPos.subtract(
        this.stageXfo__GrabStart.tr
      );
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.button != 1) return;
    this.__controllerTriggersHeld.push(event.controller);
    this.__initMoveStage(event.vrviewport);
    return true;
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (event.button != 1) return;
    const index = this.__controllerTriggersHeld.indexOf(event.controller);
    this.__controllerTriggersHeld.splice(index, 1);
    this.__initMoveStage(event.vrviewport);
    return true;
  }

  /**
   * The onVRControllerDoubleClicked method.
   * @param {any} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    console.log(
      'onVRControllerDoubleClicked:',
      this.__controllerTriggersHeld.length
    );

    const grabPos = event.controller.getControllerTipStageLocalXfo().tr;
    const stageXfo = event.vrviewport.getXfo().clone();
    const sc = stageXfo.sc.x;
    stageXfo.sc.set(1, 1, 1);
    event.vrviewport.setXfo(stageXfo);
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__controllerTriggersHeld.length == 1) {
      const grabPos = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;

      const deltaXfo = new Visualive.Xfo();
      deltaXfo.tr = this.__grabPos.subtract(grabPos);

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      event.vrviewport.setXfo(stageXfo);
      return true;
    } else if (this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerTipStageLocalXfo()
        .tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerTipStageLocalXfo()
        .tr;

      const grabPos = p0.lerp(p1, 0.5);
      const grabDir = p1.subtract(p0);
      grabDir.y = 0.0;
      const grabDist = grabDir.length();
      grabDir.scaleInPlace(1 / grabDist);

      const deltaXfo = new Visualive.Xfo();

      // //////////////
      // Compute sc
      // Limit to a 10x change in scale per grab.
      const sc = Math.max(Math.min(this.__grabDist / grabDist, 10.0), 0.1);

      // Avoid causing a scale that would make the user < 1.0 scale factor.
      const stageSc = this.stageXfo__GrabStart.sc.x * sc;
      // if(stageSc < 1.0){
      //     sc = 1.0 / this.stageXfo__GrabStart.sc.x;
      // }
      deltaXfo.sc.set(sc, sc, sc);

      // //////////////
      // Compute ori
      let angle = this.__grabDir.angleTo(grabDir);
      if (this.__grabDir.cross(grabDir).y > 0.0) {
        angle = -angle;
      }
      deltaXfo.ori.rotateY(angle);

      // Rotate around the point between the hands.
      const oriTrDelta = deltaXfo.ori.rotateVec3(this.__grabPos);
      deltaXfo.tr.addInPlace(this.__grabPos.subtract(oriTrDelta));

      // Scale around the point between the hands.
      const deltaSc = this.__grabPos.scale(1.0 - sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaSc));

      // //////////////
      // Compute tr
      // Not quite working.....
      const deltaTr = this.__grabPos.subtract(grabPos).scale(sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaTr));

      // //////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      event.vrviewport.setXfo(stageXfo);

      return true;
    }
  }
}

export { VIEW_TOOL_MODELS, ViewTool };
