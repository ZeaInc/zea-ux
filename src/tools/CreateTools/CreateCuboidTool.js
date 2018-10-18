import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateCuboidChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Cuboid");

    this.cuboid = new Visualive.Cuboid(0, 0, 0, true);
    const material = new Visualive.Material('Sphere', 'SimpleSurfaceShader');
    this.geomItem = new Visualive.GeomItem("Cuboid");
    this.geomItem.setGeometry(this.cuboid);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    if(updateData.baseSize){
      this.cuboid.setBaseSize(updateData.baseSize[0], updateData.baseSize[1]);
    }
    if(updateData.tr){
      const xfo = this.geomItem.getParameter('LocalXfo').getValue();
      xfo.tr.fromJSON(updateData.tr);
      this.geomItem.getParameter('LocalXfo').setValue(xfo);
    }
    if(updateData.height) {
      this.cuboid.z = updateData.height;
    }
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

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this._height = 0.0;
  }

  createMove(pt) {
    if(this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt);

      // const delta = pt.subtract(this.xfo.tr)
      this.undoRedoManager.updateChange({ 
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5))
        });
    }
    else {
      const vec = this.invxfo.transformVec3(pt);
      this.undoRedoManager.updateChange({ height: vec.y });
    }
  }

  createRelease(pt, viewport) {

    if(this.stage == 1){
      this.stage = 2;
      this.pt1 = pt;

      // const camera = viewport.getCamera();
      // const cameraXfo = camera.getGlobalXfo().clone();
      // const cameraZ = camera.getGlobalXfo().ori.getZaxis();
      // const planeZ = this.constructionPlane.ori.getZaxis();
      // const axis = cameraZ.cross(planeZ).normalize();
      // const quat = new Visualive.Quat();
      // quat.setFromAxisAndAngle(axis, Math.PI * 0.5);
      // this.constructionPlane.tr = pt;
      // this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat);
      
      const quat = new Visualive.Quat();
      quat.setFromAxisAndAngle(new Visualive.Vec3(1, 0, 0), Math.PI * 0.5);
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat);
      this.constructionPlane.tr = pt;
      this.invxfo = this.constructionPlane.inverse();

    }
    else if(this.stage == 2)
      this.stage = 0;
  }

}

