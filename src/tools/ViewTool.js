
import BaseTool from './BaseTool.js';

export default class ViewTool extends BaseTool {
  constructor(appData) {
    super(appData);

    this.__defaultMode = 'orbit';
    this.__mode = this.__defaultMode;

    this.__mouseDragDelta = new Visualive.Vec2();
    this.__keyboardMovement = false;
    this.__keysPressed = [];
    this.__maxVel = 0.002;
    this.__velocity = new Visualive.Vec3();

    this.__ongoingTouches = {};

    this.__orbitRateParam = this.addParameter(new Visualive.NumberParameter('orbitRate', Visualive.SystemDesc.isMobileDevice ? -0.002 : 0.01));
    this.__dollySpeedParam = this.addParameter(new Visualive.NumberParameter('dollySpeed', 0.02));
    this.__mouseWheelDollySpeedParam = this.addParameter(new Visualive.NumberParameter('mouseWheelDollySpeed', 0.002));

    this.__controllerTriggersHeld = [];

    this.movementFinished = new Visualive.Signal();
  }

  ///////////////////////////////////////
  // 

  activateTool() {
    super.activateTool();
    console.log("activateTool.ViewTool")

    this.appData.renderer.getDiv().style.cursor = "default";

    const vrviewport = this.appData.renderer.getVRViewport();
    if (vrviewport) {
      if(!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Visualive.Cross(0.03);
        this.vrControllerToolTipMat = new Visualive.Material('Cross', 'ToolIconShader');
        this.vrControllerToolTipMat.getParameter('BaseColor').setValue(new Visualive.Color("#03E3AC"));
      }
      const addIconToController = (controller) => {
        const geomItem = new Visualive.GeomItem('GizmoToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
        controller.getTipItem().addChild(geomItem, false);
      }
      for(let controller of vrviewport.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = vrviewport.controllerAdded.connect(addIconToController);
    }
  }

  deactivateTool() {
    super.deactivateTool();

    const vrviewport = this.appData.renderer.getVRViewport();
    if(vrviewport && this.vrControllerToolTip) {
      const removeIconFromController = (controller) => {
        controller.getTipItem().removeAllChildren();
      }
      for(let controller of vrviewport.getControllers()) {
        removeIconFromController(controller)
      }
    }
  }
  ///////////////////////////////////////
  // 
  setDefaultMode(mode) {
    this.__defaultMode = mode;
  }

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

    globalXfo.tr = this.__mouseDownCameraTarget.add(globalXfo.ori.getZaxis().scale(focalDistance));

    if (this.__keyboardMovement) {
      // TODO: debug this potential regression. we now use the generic method which emits a signal.
      // Avoid generating a signal because we have an animation frame occuring.
      // see: onKeyPressed
      viewport.getCamera().setGlobalXfo(globalXfo);
    } else {
      viewport.getCamera().setGlobalXfo(globalXfo);
    }
  }

  pan(dragVec, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();
    const xAxis = new Visualive.Vec3(1, 0, 0);
    const yAxis = new Visualive.Vec3(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth = cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Visualive.Xfo();
    delta.tr = xAxis.scale(-(dragVec.x / viewport.getWidth()) * cameraPlaneWidth)
    delta.tr.addInPlace(yAxis.scale((dragVec.y / viewport.getHeight()) * cameraPlaneHeight));

    viewport.getCamera().setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  dolly(dragVec, viewport) {
    const dollyDist = dragVec.x * this.__dollySpeedParam.getValue();
    const delta = new Visualive.Xfo();
    delta.tr.set(0, 0, dollyDist);
    viewport.getCamera().setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  panAndZoom(panDelta, dragDist, viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const fovY = viewport.getCamera().getFov();

    const xAxis = new Visualive.Vec3(1, 0, 0);
    const yAxis = new Visualive.Vec3(0, 1, 0);

    const cameraPlaneHeight = 2.0 * focalDistance * Math.tan(0.5 * fovY);
    const cameraPlaneWidth = cameraPlaneHeight * (viewport.getWidth() / viewport.getHeight());
    const delta = new Visualive.Xfo();
    delta.tr = xAxis.scale(-(panDelta.x / viewport.getWidth()) * cameraPlaneWidth)
    delta.tr.addInPlace(yAxis.scale((panDelta.y / viewport.getHeight()) * cameraPlaneHeight));


    const zoomDist = dragDist * focalDistance;
    viewport.getCamera().setFocalDistance(this.__mouseDownFocalDist + zoomDist);
    delta.tr.z += zoomDist;
    viewport.getCamera().setGlobalXfo(this.__mouseDownCameraXfo.multiply(delta));
  }

  initDrag(viewport) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    this.__mouseDragDelta.set(0, 0);
    this.__mouseDownCameraXfo = viewport.getCamera().getGlobalXfo().clone();
    this.__mouseDownZaxis = viewport.getCamera().getGlobalXfo().ori.getZaxis();
    const targetOffset = this.__mouseDownZaxis.scale(-focalDistance);
    this.__mouseDownCameraTarget = viewport.getCamera().getGlobalXfo().tr.add(targetOffset);
    this.__mouseDownFocalDist = focalDistance;
  }

  onMouseMove(event) {

  }

  onDragStart(event) {

    this.__mouseDownPos = event.mousePos;
    this.initDrag(event.viewport);

    if (event.button == 2) {
      this.__mode = 'pan';
    } else if (event.ctrlKey && event.button == 2) {
      this.__mode = 'dolly';
    }/* else if (event.ctrlKey || event.button == 2) {
      this.__mode = 'look';
    }*/ else {
      this.__mode = this.__defaultMode;
    }
  }

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

  onDragEnd(event, mouseUpPos, viewport) {
    viewport.renderGeomDataFbo();
    this.movementFinished.emit();
    return false;
  }


  onMouseDown(event) {
    this.dragging = true;
    this.__mouseDownPos = event.mousePos;
    this.onDragStart(event)
    return true;
  }

  onMouseUp(event) {
      if (this.dragging) {
          this.onDragEnd(event);
          this.dragging = false;
          return true;
      }
  }

  onMouseMove(event) {
      if (this.dragging) {
          this.onDrag(event);
          return true; 
      }
  }

  onWheel(event) {
    const focalDistance = viewport.getCamera().getFocalDistance();
    const mouseWheelDollySpeed = this.__mouseWheelDollySpeedParam.getValue();
    const zoomDist = event.deltaY * mouseWheelDollySpeed * focalDistance;
    const xfo = viewport.getCamera().getGlobalXfo();
    xfo.tr.addInPlace(xfo.ori.getZaxis().scale(zoomDist));
    if (this.__defaultMode == 'orbit')
      viewport.getCamera().setFocalDistance( focalDistance + zoomDist);
    viewport.getCamera().setGlobalXfo(xfo);
    viewport.renderGeomDataFbo();
    this.movementFinished.emit();
  }

  __integrateVelocityChange(velChange, viewport) {
    const delta = new Visualive.Xfo();
    delta.tr = this.__velocity.normalize().scale(this.__maxVel);
    viewport.getCamera().setGlobalXfo(viewport.getCamera().getGlobalXfo().multiply(delta));
  }

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
    return false;// no keys handled
  }

  onKeyDown(key, event) {}

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

  /////////////////////////////////////
  // Touch events

  __startTouch(touch, viewport) {
    this.__ongoingTouches[touch.identifier] = {
      identifier: touch.identifier,
      pos: new Vec2(touch.pageX, touch.pageY)
    };
  }
  __endTouch(touch, viewport) {
    // let idx = this.__ongoingTouchIndexById(touch.identifier);
    // this.__ongoingTouches.splice(idx, 1); // remove it; we're done
    delete this.__ongoingTouches[touch.identifier];
  }


  onTouchStart(event) {
    // console.log("onTouchStart");
    event.preventDefault();
    event.stopPropagation();

    if (Object.keys(this.__ongoingTouches).length == 0)
      this.__manipMode = undefined;

    let touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__startTouch(touches[i]);
    }
    this.initDrag(viewport);
    return true;
  }

  onTouchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log("this.__manipMode:" + this.__manipMode);

    let touches = event.changedTouches;
    if (touches.length == 1 && this.__manipMode != "panAndZoom") {
      let touch = touches[0];
      let touchPos = new Vec2(touch.pageX, touch.pageY);
      let touchData = this.__ongoingTouches[touch.identifier];
      let dragVec = touchData.pos.subtract(touchPos);
      if (this.__defaultMode == 'look') {
        // TODO: scale panning here.
        dragVec.scaleInPlace(6.0);
        this.look(dragVec, viewport);
      } else {
        this.orbit(dragVec, viewport);
      }
      return true;
    } else if (touches.length == 2) {
      let touch0 = touches[0];
      let touchData0 = this.__ongoingTouches[touch0.identifier];
      let touch1 = touches[1];
      let touchData1 = this.__ongoingTouches[touch1.identifier];

      let touch0Pos = new Vec2(touch0.pageX, touch0.pageY);
      let touch1Pos = new Vec2(touch1.pageX, touch1.pageY);
      let startSeparation = touchData1.pos.subtract(touchData0.pos).length();
      let dragSeparation = touch1Pos.subtract(touch0Pos).length();
      let separationDist = startSeparation - dragSeparation;

      let touch0Drag = touch0Pos.subtract(touchData0.pos);
      let touch1Drag = touch1Pos.subtract(touchData1.pos);
      let dragVec = touch0Drag.add(touch1Drag);
      // TODO: scale panning here.
      dragVec.scaleInPlace(0.5);
      this.panAndZoom(dragVec, separationDist * 0.002, viewport);
      this.__manipMode = "panAndZoom";
      return true;
    }
  }

  onTouchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    let touches = event.changedTouches;
    // switch (this.__manipMode) {
    // case 'camera-manipulation':
    //     let touch = touches[0];
    //     let releasePos = new Vec2(touch.pageX, touch.pageY);
    //     viewport.getCamera().onDragEnd(event, releasePos, viewport);
    //     break;
    // }
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    return true;
  }

  onTouchCancel(event) {
    event.preventDefault();
    console.log("touchcancel.");
    let touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.__endTouch(touches[i]);
    }
    return true;
  }


  /////////////////////////////////////
  // VRController events

  __initMoveStage(vrviewport){

    if(this.__controllerTriggersHeld.length == 1) {
      this.__grabPos = this.__controllerTriggersHeld[0].getControllerStageLocalXfo().tr.clone();
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__invOri = this.stageXfo__GrabStart.ori.inverse();
    }
    else if(this.__controllerTriggersHeld.length == 2) {
      const p0 = this.__controllerTriggersHeld[0].getControllerStageLocalXfo().tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerStageLocalXfo().tr;
      this.__grabDir = p1.subtract(p0);
      this.__grabPos = p0.lerp(p1, 0.5);
      this.__grabDist = this.__grabDir.length();
      this.__grabDir.y = 0.0;
      this.__grabDir.normalizeInPlace();
      this.stageXfo__GrabStart = vrviewport.getXfo().clone();
      this.__grab_to_stage = this.__grabPos.subtract(this.stageXfo__GrabStart.tr);
    }
  }

  onVRControllerButtonDown(event, vrviewport) {
    if(event.button != 1)
      return;
    this.__controllerTriggersHeld.push(event.controller);
    this.__initMoveStage(vrviewport);
    return true;
  }

  onVRControllerButtonUp(event, vrviewport) {
    if(event.button != 1)
      return;
    const index = this.__controllerTriggersHeld.indexOf(event.controller);
    this.__controllerTriggersHeld.splice(index, 1);
    this.__initMoveStage(vrviewport);
    return true;
  }

  onVRPoseChanged(event, vrviewport) {

    if(this.__controllerTriggersHeld.length == 1) {
      const grabPos = this.__controllerTriggersHeld[0].getControllerStageLocalXfo().tr;

      const deltaXfo = new Visualive.Xfo();
      deltaXfo.tr = this.__grabPos.subtract(grabPos);

      ////////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      vrviewport.setXfo(stageXfo);
      return true;
    }
    else if(this.__controllerTriggersHeld.length == 2) {

      const p0 = this.__controllerTriggersHeld[0].getControllerStageLocalXfo().tr;
      const p1 = this.__controllerTriggersHeld[1].getControllerStageLocalXfo().tr;

      const grabPos = p0.lerp(p1, 0.5);
      const grabDir = p1.subtract(p0);

      const deltaXfo = new Visualive.Xfo();

      ////////////////
      // Compute sc
      // Limit to a 10x change in scale per grab.
      const sc = Math.max(Math.min(this.__grabDist / grabDir.length(), 10.0), 0.1);

      // Avoid causing a scale that would make the user < 1.0 scale factor.
      const stageSc = this.stageXfo__GrabStart.sc.x * sc;
      // if(stageSc < 1.0){
      //     sc = 1.0 / this.stageXfo__GrabStart.sc.x;
      // }

      deltaXfo.sc.set(sc, sc, sc);

      ////////////////
      // Compute ori
      grabDir.y = 0.0;
      grabDir.normalizeInPlace();
      let angle = this.__grabDir.angleTo(grabDir);
      if(this.__grabDir.cross(grabDir).y > 0.0){
        angle = -angle;
      }
      deltaXfo.ori.rotateY(angle);

      // Rotate around the point between the hands.
      const oriTrDelta = deltaXfo.ori.rotateVec3(this.__grabPos);
      deltaXfo.tr.addInPlace(this.__grabPos.subtract(oriTrDelta));

      // Scale around the point between the hands.
      const deltaSc = this.__grabPos.scale(1.0-sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaSc));

      ////////////////
      // Compute tr
      // Not quite working.....
      const deltaTr = this.__grabPos.subtract(grabPos).scale(sc);
      deltaXfo.tr.addInPlace(deltaXfo.ori.rotateVec3(deltaTr));



      ////////////////
      // Update the stage Xfo
      const stageXfo = this.stageXfo__GrabStart.multiply(deltaXfo);
      vrviewport.setXfo(stageXfo);

      return true;
    }

  }

};
