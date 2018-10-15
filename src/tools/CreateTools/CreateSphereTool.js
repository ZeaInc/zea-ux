import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateSphereChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Sphere");

    const sphere = new Visualive.Sphere(0.0);
    const material = new Visualive.Material("Sphere");
    this.geomItem = new Visualive.GeomItem("Sphere");
    this.geomItem.setGeometry(sphere);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.geomItem.setGlobalXfo(this.xfo);
      this.redo();
    }
  }

  update(updateData) {
    this.geomItem.getGeometry().setRadius(this.radius)
  }
}

export default class CreateSphereTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo) {
    this.xfo = xfo;
    const scene = viewport.getRenderer().getScene();
    const change = new CreateSphereChange(scene.getRoot(), xfo);
    this.undoRedoManager.addChange(change);
    this.__stage = 1;
    this.radius = 0.0;
  }

  createMove(pt) {
    this.radius = pt.distanceTo(pt);
    this.undoRedoManager.updateChange({ radius: this.radius });
  }

  createRelease(pt) {
    if (this.radius == 0) {
      this.undoRedoManager.undo();
    }
    this.__stage = 0;
  }
}

