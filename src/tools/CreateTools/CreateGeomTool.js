
import BaseCreateTool from '../BaseCreateTool.js';
import Change from '../../undoredo/Change.js';

class CreateGeomChange extends Change {
  constructor(name) {
    super(name);
  }

  setParentAndXfo(parentItem, xfo) {
    this.parentItem = parentItem;
    const name = this.parentItem.generateUniqueName(this.geomItem.getName());
    this.geomItem.setName(name)
    this.geomItem.setGlobalXfo(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, true);

    this.geomItem.addRef(this);// keep a ref to stop it being destroyed
  }

  undo() {
    this.parentItem.removeChild(this.childIndex)
  }

  redo() {
    this.parentItem.addChild(this.geomItem, false, false)
  }

  toJSON(appData) {
    const j = super.toJSON();
    j.parentItemPath = this.parentItem.getPath();
    j.geomItemName = this.geomItem.getName();
    j.geomItemXfo = this.geomItem.getParameter('LocalXfo').getValue();
    return j;
  }

  fromJSON(j, appData) {
    this.parentItem = appData.scene.getRoot().resolvePath(j.parentItemPath, 1);
    this.geomItem.setName(j.geomItemName);
    const xfo = new Visualive.Xfo();
    xfo.fromJSON(j.geomItemXfo)
    this.geomItem.setLocalXfo(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem, false);
  }

  // changeFromJSON(j) {
  //   if (this.__newValue.fromJSON)
  //     this.__newValue.fromJSON(j.value);
  //   else
  //     this.__newValue = j.value;
  // }

  destroy() {
    this.geomItem.removeRef(this);// remove the tmp ref.
  }
}

class CreateGeomTool extends BaseCreateTool {
  constructor(appData) {
    super(appData);

    this.stage = 0;

    this.cp = this.addParameter(new Visualive.ColorParameter('Line Color', new Visualive.Color(.7, .2, .2)));
  }

  activateTool() {
    super.activateTool();

    this.appData.renderer.getDiv().style.cursor = "crosshair";

    this.appData.renderer.getXRViewport().then(xrvp => {
      if(!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Visualive.Cross(0.05);
        this.vrControllerToolTipMat = new Visualive.Material('VRController Cross', 'LinesShader');
        this.vrControllerToolTipMat.getParameter('Color').setValue(this.cp.getValue());
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false;
      }
      const addIconToController = (controller) => {
        const geomItem = new Visualive.GeomItem('CreateGeomToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat);
        controller.getTipItem().removeAllChildren();
        controller.getTipItem().addChild(geomItem, false);
      }
      for(let controller of xrvp.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = xrvp.controllerAdded.connect(addIconToController);
    });

  }

  deactivateTool() {
    super.deactivateTool();

    this.appData.renderer.getDiv().style.cursor = "pointer";

    this.appData.renderer.getXRViewport().then(xrvp => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.controllerAdded.disconnectId(this.addIconToControllerId);
    });
  }

  screenPosToXfo(screenPos, viewport) {
    // 

    const ray = viewport.calcRayFromScreenPos(screenPos);

    // Raycast any working planes.
    const planeRay = new Visualive.Ray(this.constructionPlane.tr, this.constructionPlane.ori.getZaxis());
    const dist = ray.intersectRayPlane(planeRay);
    if(dist > 0.0) {
      const xfo = this.constructionPlane.clone();
      xfo.tr = ray.pointAtDist(dist);
      return xfo;
    }

    // else project based on focal dist.
    const camera = viewport.getCamera();
    const xfo = camera.getGlobalXfo().clone();
    xfo.tr = ray.pointAtDist(camera.getFocalDistance());
    return xfo;
  }

  createStart(xfo, parentItem) {
    this.stage = 1;
  }

  createPoint(pt) {
  }

  createMove(pt) {
  }

  createRelease(pt) {
  }

  /////////////////////////////////////
  // Mouse events

  onMouseDown(event) {
    // 
    if(this.stage == 0) {
      if(event.button == 0) {
        this.constructionPlane = new Visualive.Xfo();

        const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
        this.createStart(xfo, this.appData.scene.getRoot());
      }
      else if(event.button == 2) {
        // Cancel the tool. 
        this.appData.toolManager.removeTool(this.index);
      }
      return true;
    }
    else if(event.button == 2) {
      this.appData.undoRedoManager.undo(false);
      this.stage = 0;
      return true;
    }
    return true;
  }

  onMouseMove(event) {
    if(this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createMove(xfo.tr)
      return true;
    }
  }

  onMouseUp(event) {
    if(this.stage > 0) {
      const xfo = this.screenPosToXfo(event.mousePos, event.viewport);
      this.createRelease(xfo.tr);
      return true;
    }
  }

  onWheel(event) {}

  /////////////////////////////////////
  // Keyboard events
  onKeyPressed(key, event) {}

  onKeyDown(key, event) {}

  onKeyUp(key, event) {}

  /////////////////////////////////////
  // Touch events
  onTouchStart(event) {}

  onTouchMove(event) {}

  onTouchEnd(event) {}

  onTouchCancel(event) {}

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    if(!this.__activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.__activeController = event.controller;
      this.constructionPlane = new Visualive.Xfo();
      const xfo = this.constructionPlane.clone();
      xfo.tr = this.__activeController.getTipXfo().tr
      this.createStart(xfo, this.appData.scene.getRoot());
    }
    return true;
  }

  onVRPoseChanged(event) {
    if(this.__activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.__activeController.getTipXfo();
      this.createMove(xfo.tr);
      return true;
    }
  }

  onVRControllerButtonUp(event) {
    if(this.stage > 0) {
      if(this.__activeController == event.controller){
        const xfo = this.__activeController.getTipXfo();
        this.createRelease(xfo.tr);
        if(this.stage == 0)
          this.__activeController = undefined;
        return true;
      }
    }
  }

};


export {
  CreateGeomChange,
  CreateGeomTool
};