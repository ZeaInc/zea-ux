;
import {
  BaseCreateTool
} from '../BaseCreateTool.js';


class CreateGeomChange extends Change {
  constructor(name, parentItem, geomItem) {
    super(name);
    if(parentItem && geomItem) {
      this.__parentItem = parentItem;
      this.__geomItem = geomItem;
      this.redo();
    }
  }

  update(updateData) {

  }

  undo() {
    this.__parentItem.removeChild(this.__geomItem, false)
  }

  redo() {
    this.__parentItem.addChild(this.__geomItem, false)
  }


  toJSON() {
    const j = super.toJSON();
    if (this.__newValue.toJSON) {
      j.newValue = this.__newValue.toJSON();
    } else {
      j.newValue = this.__newValue;
    }
    return j;
  }

  fromJSON(j, root) {
    this.__param = root.resolvePath(j.paramPath);
    this.__oldValue = this.__param.getValue();
    if (this.__newValue.fromJSON)
      this.__newValue = this.__oldValue.clone();
    this.changeFromJSON(j);
  }

  changeFromJSON(j) {
    if (this.__newValue.fromJSON)
      this.__newValue.fromJSON(j.value);
    else
      this.__newValue = j.value;
  }
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
      this.xfo = this.screenPosToXfo(mousePos);
      this.constructionPlane = new Visualive.Ray(this.xfo.tr, this.ori.getZAxis());

      this.createStart(xfo)
    }
    else if(event.button == 2) {
      this.undoRedoManager.undo();
      this.__stage = 0;
    }
  }

  onMouseMove(event, mousePos, viewport) {
    if(this.__stage > 0) {
      const ray = this.calcRayFromScreenPos(mousePos);
      const pt = ray.intersectRayPlane(this.constructionPlane)
      this.createMove(pt)
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