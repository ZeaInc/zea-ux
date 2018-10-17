
import BaseCreateTool from '../BaseCreateTool.js';
import Change from '../../undoredo/Change.js';

class CreateGeomChange extends Change {
  constructor(name, parentItem) {
    super(name);
    this.parentItem = parentItem;
  }

  update(updateData) {

  }

  undo() {
    this.parentItem.removeChild(this.__geomItem, false)
  }

  redo() {
    this.parentItem.addChild(this.__geomItem, false)
  }


  toJSON() {
    const j = super.toJSON();
    if (this.parentItem) 
      j.parentItemPath = this.parentItem.getPath();
    return j;
  }

  fromJSON(j, root) {
    this.parentItem = root.resolvePath(j.parentItemPath);
    this.changeFromJSON(j);
  }

  // changeFromJSON(j) {
  //   if (this.__newValue.fromJSON)
  //     this.__newValue.fromJSON(j.value);
  //   else
  //     this.__newValue = j.value;
  // }
}

class CreateGeomTool extends BaseCreateTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.__stage = 0;
  }

  createStart(xfo) {
    this.__stage = 1;
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
    if(this.__stage == 0) {
      this.xfo = this.screenPosToXfo(mousePos, viewport);
      this.constructionPlane = new Visualive.Ray(this.xfo.tr, this.xfo.ori.getZaxis());

      const scene = viewport.getRenderer().getScene();
      this.createStart(this.xfo, scene.getRoot())
    }
    else if(event.button == 2) {
      this.undoRedoManager.undo();
      this.__stage = 0;
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if(this.__stage > 0) {
      const ray = viewport.calcRayFromScreenPos(mousePos);
      const dist = ray.intersectRayPlane(this.constructionPlane);

      this.createMove(ray.pointAtDist(dist))
    }
  }

  onMouseUp(event, mousePos, viewport) {
    if(this.__stage > 0) {
      this.createRelease();
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
    if(this.__stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.createMove(event.xfo.tr);
    }
  }

  onVRControllerUp(event, mousePos, viewport) {
    if(this.__stage > 0) {
      this.createRelease();
    }
  }

};


export {
  CreateGeomChange,
  CreateGeomTool
};