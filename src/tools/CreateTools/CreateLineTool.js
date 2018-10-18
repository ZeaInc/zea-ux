import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateLineChange extends CreateGeomChange {
  constructor(parentItem, xfo) {
    super("Create Line");

    this.lineGeom = new Visualive.Lines(0.0);
    this.lineGeom.setNumVertices(2)
    this.lineGeom.setNumSegments(1);
    this.lineGeom.setSegment(0, 0, 1);
    const linesMaterial = new Visualive.Material('LabelLinesMaterial', 'LinesShader');
    linesMaterial.getParameter('Color').setValue(new Visualive.Color(.7, .7, .7));
    this.geomItem = new Visualive.GeomItem("Line");
    this.geomItem.setGeometry(this.lineGeom);
    this.geomItem.setMaterial(linesMaterial);

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    this.lineGeom.getVertex(1).setFromOther(updateData.p1)
    this.lineGeom.geomDataChanged.emit();
  }
}

export default class CreateLineTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);
  }

  createStart(xfo, parentItem) {
    const change = new CreateLineChange(parentItem, xfo);
    this.undoRedoManager.addChange(change);
    
    this.xfo = xfo.inverse();
    this.stage = 1;
    this.length = 0.0;
  }

  createMove(pt) {
    const offet = this.xfo.transformVec3(pt)
    this.length = offet.length();
    this.undoRedoManager.updateChange({ p1: offet });
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }
}
