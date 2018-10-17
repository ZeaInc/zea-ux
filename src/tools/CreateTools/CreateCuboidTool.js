import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateCuboidChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Cuboid", parentItem);

    this.cuboid = new Visualive.Cuboid(0.0, 0.0, 0.0);
    const material = new Visualive.Material('Sphere', 'SimpleSurfaceShader');
    this.geomItem = new Visualive.GeomItem("Cuboid");
    this.geomItem.setGeometry(this.cuboid);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.geomItem.setGlobalXfo(xfo);
      const name = this.parentItem.generateUniqueName(this.geomItem.getName());
      this.geomItem.setName(name)
      this.parentItem.addChild(this.geomItem)
    }
  }

  update(updateData) {
    if(updateData.baseSize){
      console.log("this.cuboid.setBase", updateData.baseSize.toString())
      this.cuboid.setBase(updateData.baseSize.x, updateData.baseSize.y);
    }
    if(updateData.height)
      console.log("this.cuboid.height", updateData.height.toString())
      this.cuboid.z = updateData.height;
  }
}


export default class CreateCuboidTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
    console.log("Create Cuboid");
  }

  createStart(xfo, parentItem) {

    const change = new CreateCuboidChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);

    this.xfo = xfo.inverse();
    this.stage = 1;
    this._height = 0.0;
  }

  createMove(pt) {
    if(this.stage == 1) {
      const delta = this.xfo.transformVec3(pt);
      this.undoRedoManager.updateChange({ baseSize: delta });
    }
    else {
      const vec = pt.subtract(this.xfo.tr)
      this._height = vec.length();
      // this._height = vec.dot(this.xfo.ori.getZAxis()).length();
      this.undoRedoManager.updateChange({ height: this._height });
    }
  }

  createRelease(pt) {
    // if (this._radius == 0 || this._height == 0) {
    //   this.undoRedoManager.undo();
    //   this.stage = 0;
    // }
    if(this.stage == 1)
      this.stage = 2;
    else if(this.stage == 2)
      this.stage = 0;
  }

}

