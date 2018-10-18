import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateConeChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Cone");

    const cone = new Visualive.Cone(0.0, 0.0);
    const material = new Visualive.Material("Sphere");
    this.geomItem = new Visualive.GeomItem("Sphere");
    this.geomItem.setGeometry(cone);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if(updateData.radius)
      this.geomItem.getGeometry().setRadius(updateData.radius)
    if(updateData.height)
      this.geomItem.getGeometry().setHeight(updateData.height)
  }
}


export default class CreateConeTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo) {
    this.xfo = xfo;

    const scene = viewport.getRenderer().getScene();
    const change = new CreateConeChange(scene.getRoot(), xfo);
    this.undoRedoManager.addChange(change);

    this.stage = 1;
    this._radius = 0.0;
    this._height = 0.0;
  }

  createMove(pt) {
    if(this.stage == 1) {
      const vec = pt.subtract(this.xfo.tr)
      // TODO: Rotate the cone so the base is aligned with the vector towards the controller
      this._radius = vec.subtract(vec.dot(this.xfo.ori.getZAxis())).length();
      this.undoRedoManager.updateChange({ radius: this._radius });
    }
    else {
      const vec = pt.subtract(this.xfo.tr)
      this._height = vec.dot(this.xfo.ori.getZAxis()).length();
      this.undoRedoManager.updateChange({ height: this._height });
    }
  }

  createRelease(pt) {
    if (this._radius == 0 || this._height == 0) {
      this.undoRedoManager.undo(false);
      this.stage = 0;
    }
    if(this.stage == 1)
      this.stage = 2;
    else if(this.stage == 2)
      this.stage = 0;
  }

}

