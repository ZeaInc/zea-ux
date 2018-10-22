import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateFreehandLineChange extends CreateGeomChange {
  constructor(parentItem, xfo, color, thickness) {
    super("Create Freehand Line");

    this.used = 0;
    this.vertexCount = 100;

    this.line = new Visualive.Lines();
    this.line.setNumVertices(this.vertexCount);
    this.line.setNumSegments(this.vertexCount - 1);
    this.line.vertices.setValue(0, new Visualive.Vec3());

    // const material = new Visualive.Material('freeHandLine', 'LinesShader');
    this.line.lineThickness = 0.05;
    // const material = new Visualive.Material('circle', 'LinesShader');
    const material = new Visualive.Material('freeHandLine', 'FatLinesShader');

    this.geomItem = new Visualive.GeomItem("freeHandLine");
    this.geomItem.setGeometry(this.line);
    this.geomItem.setMaterial(material);

    if(color) {
      material.getParameter('Color').setValue(color);
    }

    if(thickness) {
      this.line.lineThickness = thickness;
      // this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);
    }

    if(parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo);
    }
  }

  update(updateData) {
    // console.log("update:", this.used)

    this.used++;

    let realloc = false;
    if (this.used >= this.line.getNumSegments()) {
        this.vertexCount = this.vertexCount + 100;
        this.line.setNumVertices(this.vertexCount);
        this.line.setNumSegments(this.vertexCount - 1);
        realloc = true;
    }

    this.line.vertices.setValue(this.used, updateData.point);
    // this.line.getVertexAttributes().lineThickness.setValue(this.used, updateData.lineThickness);
    this.line.setSegment(this.used - 1, this.used - 1, this.used);

    if (realloc) {
        this.line.geomDataTopologyChanged.emit({
            'indicesChanged': true
        });
    } else {
        this.line.geomDataChanged.emit({
            'indicesChanged': true
        });
    }

  }
}
UndoRedoManager.registerChange(CreateFreehandLineChange)

export default class CreateFreehandLineTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.cp = this.addParameter(new Visualive.ColorParameter('Line Color', new Visualive.Color(.7, .2, .2)));
    this.tp = this.addParameter(new Visualive.NumberParameter('Line Thickness', 0.01, [0, 0.1])); // 1cm.
    this.mp = this.addParameter(new Visualive.BooleanParameter('Modulate Thickness By Stroke Speed', false));
  }

  createStart(xfo, parentItem) {

    const color = this.cp.getValue();
    const lineThickness = this.tp.getValue();
    const change = new CreateFreehandLineChange(parentItem, xfo, color, lineThickness);
    this.undoRedoManager.addChange(change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this.prevP = xfo.tr;
    this.length = 0;
  }

  createMove(pt) {
    const p = this.invxfo.transformVec3(pt);
    const vel = p.subtract(this.prevP).length();

    this.undoRedoManager.updateChange({ point: p });

    this.length += vel; 
    this.prevP = p;
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.undoRedoManager.undo(false);
    }
    this.stage = 0;
  }
}
