import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateLineChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Line");

    const line = new Visualive.Lines(0.0);
    line.setNumVertices(2)
    line.setNumSegments(1);
    const material = new Visualive.Material("Line");
    this.geomItem = new Visualive.GeomItem("Line");
    this.geomItem.setGeometry(line);
    this.geomItem.setMaterial(material);

    if(parentItem && xfo) {
      this.geomItem.setGlobalXfo(this.xfo);
      this.redo();
    }
  }

  update(updateData) {
    this.geomItem.getGeometry().getVertex(1).setFromOther(updateData.p1)
  }
}

export default class CreateLineTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo) {
    this.xfo = xfo;
    const scene = viewport.getRenderer().getScene();
    const change = new CreateLineChange(scene.getRoot(), xfo);
    this.undoRedoManager.addChange(change);
    this.__stage = 1;
    this.length = 0.0;
  }

  createMove(pt) {
    const offet = pt.subtract(this.xfo.tr)
    this.length = offet.length();
    this.undoRedoManager.updateChange({ p1: offet });
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.undoRedoManager.undo();
    }
    this.__stage = 0;
  }
}
