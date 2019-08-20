import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import { CreateGeomChange, CreateGeomTool } from './CreateGeomTool.js';

/**
 * Class representing a create cuboid change.
 * @extends CreateGeomChange
 */
class CreateCuboidChange extends CreateGeomChange {
  /**
   * Create a create cuboid change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   */
  constructor(parentItem, xfo) {
    super('Create Cuboid');

    this.cuboid = new Visualive.Cuboid(0, 0, 0, true);
    const material = new Visualive.Material('Cuboid', 'SimpleSurfaceShader');
    this.geomItem = new Visualive.GeomItem('Cuboid');
    this.geomItem.setGeometry(this.cuboid);
    this.geomItem.setMaterial(material);

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if (updateData.baseSize) {
      this.cuboid.setBaseSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if (updateData.tr) {
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }
    if (updateData.height) {
      this.cuboid.z = updateData.height;
    }
    this.updated.emit(updateData);
  }
}
UndoRedoManager.registerChange('CreateCuboidChange', CreateCuboidChange);

class CreateCuboidTool extends CreateGeomTool {
  constructor(appData) {
    super(appData);
  }

  createStart(xfo, parentItem) {
    this.change = new CreateCuboidChange(parentItem, xfo);
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._height = 0.0;
  }

  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt);

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      });
    } else {
      const vec = this.invxfo.transformVec3(pt);
      this.change.update({ height: vec.y });
    }
  }

  createRelease(pt, viewport) {
    if (this.stage == 1) {
      this.stage = 2;
      this.pt1 = pt;

      const quat = new Visualive.Quat();
      quat.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * 0.5);
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat);
      this.constructionPlane.tr = pt;
      this.invxfo = this.constructionPlane.inverse();
    } else if (this.stage == 2) {
      this.stage = 0;
      this.actionFinished.emit();
    }
  }
}

export { CreateCuboidTool };
