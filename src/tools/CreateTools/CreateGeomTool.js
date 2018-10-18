
import BaseCreateTool from '../BaseCreateTool.js';
import Change from '../../undoredo/Change.js';

class CreateGeomChange extends Change {
  constructor(name) {
    super(name);
  }

  setParentAndXfo(parentItem, xfo) {
    this.parentItem = parentItem;
    this.geomItem.setGlobalXfo(xfo);
    const name = this.parentItem.generateUniqueName(this.geomItem.getName());
    this.geomItem.setName(name)
    this.childIndex = this.parentItem.addChild(this.geomItem)

    this.geomItem.addRef(this);// keep a ref to stop it being destroyed
  }

  update(updateData) {

  }

  undo() {
    this.parentItem.removeChild(this.childIndex)
  }

  redo() {
    this.parentItem.addChild(this.geomItem, false, false)
  }

  toJSON() {
    const j = super.toJSON();
    j.parentItemPath = this.parentItem.getPath();
    j.geomItemName = this.geomItem.getName();
    j.geomItemXfo = this.geomItem.getParameter('LocalXfo').getValue();
    return j;
  }

  fromJSON(j, root) {
    this.parentItem = root.resolvePath(j.parentItemPath);
    this.geomItem.setName(j.geomItemName);
    const xfo = new Visualive.Xfo();
    xfo.fromJSON(j.geomItemXfo)
    this.geomItem.setLocalXfo(xfo);
    this.childIndex = this.parentItem.addChild(this.geomItem)
    this.changeFromJSON(j);
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
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.stage = 0;
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

  createStart(xfo) {
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

  onMouseDown(event, mousePos, viewport) {
    // 
    if(this.stage == 0) {
      const scene = viewport.getRenderer().getScene();
      this.constructionPlane = new Visualive.Xfo();

      this.xfo = this.screenPosToXfo(mousePos, viewport);

      this.createStart(this.xfo, scene.getRoot())
    }
    else if(event.button == 2) {
      this.undoRedoManager.undo(false);
      this.stage = 0;
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if(this.stage > 0) {
      const xfo = this.screenPosToXfo(mousePos, viewport);
      this.createMove(xfo.tr)
    }
  }

  onMouseUp(event, mousePos, viewport) {
    if(this.stage > 0) {
      const xfo = this.screenPosToXfo(mousePos, viewport);
      this.createRelease(xfo.tr, viewport);
    }
  }

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

  onVRControllerDown(event, viewport) {
    // TODO: Snap the Xfo to any nearby construction planes.
    this.createStart(event.xfo);
  }

  onVRControllerMove(event, mousePos, viewport) {
    if(this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.createMove(event.xfo.tr);
    }
  }

  onVRControllerUp(event, mousePos, viewport) {
    if(this.stage > 0) {
      this.createRelease();
    }
  }

};


export {
  CreateGeomChange,
  CreateGeomTool
};