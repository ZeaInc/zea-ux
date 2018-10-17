import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateSphereChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Sphere", parentItem);

    const sphere = new Visualive.Sphere(0, 64, 32);
    const material = new Visualive.Material('Sphere', 'SimpleSurfaceShader');
    this.geomItem = new Visualive.GeomItem('Sphere');
    this.geomItem.setGeometry(sphere);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.geomItem.setGlobalXfo(xfo);
      const name = this.parentItem.generateUniqueName(this.geomItem.getName());
      this.geomItem.setName(name)
      this.parentItem.addChild(this.geomItem)
    }
  }

  update(updateData) {
    this.geomItem.getGeometry().radius = updateData.radius;
  }

  toJSON() {
    const j = super.toJSON();
    j.radius = this.geomItem.getGeometry().radius;
    return j;
  }

  changeFromJSON(j) {
    if (j.radius)
      this.geomItem.getGeometry().radius =j.radius;
  }
}

export default class CreateSphereTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo, parentItem) {
    this.xfo = xfo;
    const change = new CreateSphereChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);
    this.__stage = 1;
    this.radius = 0.0;
  }

  createMove(pt) {
    this.radius = pt.distanceTo(this.xfo.tr);
    this.undoRedoManager.updateChange({ radius: this.radius });
  }

  createRelease(pt) {
    // if (this.radius == 0) {
    //   this.undoRedoManager.undo();
    // }
    this.__stage = 0;
  }
}

