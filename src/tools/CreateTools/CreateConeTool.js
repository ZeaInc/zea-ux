import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js';

class CreateConeChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super('Create Cone');

    const cone = new Visualive.Cone(0.0, 0.0);
    const material = new Visualive.Material('Sphere');
    this.geomItem = new Visualive.GeomItem('Sphere');
    this.geomItem.setGeometry(cone);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if (updateData.radius)
      this.geomItem.getGeometry().setRadius(updateData.radius);
    if (updateData.height)
      this.geomItem.getGeometry().setHeight(updateData.height);
    this.updated.emit(updateData);
  }
}
UndoRedoManager.registerChange('CreateCircleChange', CreateCircleChange);

class CreateConeTool extends CreateGeomTool {
  constructor(appData) {
    super(appData);
  }

  createStart(xfo) {
    this.xfo = xfo;

    const scene = viewport.getRenderer().getScene();
    this.change = new CreateConeChange(scene.getRoot(), xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.stage = 1;
    this._radius = 0.0;
    this._height = 0.0;
  }

  createMove(pt) {
    if (this.stage == 1) {
      const vec = pt.subtract(this.xfo.tr);
      // TODO: Rotate the cone so the base is aligned with the vector towards the controller
      this._radius = vec.subtract(vec.dot(this.xfo.ori.getZAxis())).length();
      this.change.update({ radius: this._radius });
    } else {
      const vec = pt.subtract(this.xfo.tr);
      this._height = vec.dot(this.xfo.ori.getZAxis()).length();
      this.change.update({ height: this._height });
    }
  }

  createRelease(pt) {
    if (this._radius == 0 || this._height == 0) {
      this.appData.undoRedoManager.undo(false);
      this.stage = 0;
      this.actionFinished.emit();
    }
    if (this.stage == 1) {
      this.stage = 2;
    } else if (this.stage == 2) {
      this.stage = 0;
      this.actionFinished.emit();
    }
  }
}

export { CreateConeTool };
