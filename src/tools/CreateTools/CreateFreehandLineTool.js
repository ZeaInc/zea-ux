import {
  CreateGeomChange,
  CreateGeomTool
} from './CreateGeomTool.js';

class CreateFreehandLineChange extends CreateGeomChange {
  constructor(parentItem, xfo, thickness, color) {
    super("Create Freehand Line");

    ///////////////
    //

    this.__used = 0;
    this.__vertexCount = 100;

    this.line = new Lines();
    this.line.setNumVertices(this.__vertexCount);
    this.line.setNumSegments(this.__vertexCount - 1);
    this.line.vertices.setValue(used, xfo.tr);

    this.line.lineThickness = thickness;
    this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);

    const material = new Visualive.Material('stroke', 'FatLinesShader');

    this.geomItem = new GeomItem(id, this.line, material);


    if(parentItem && xfo && thickness && color) {
      this.geomItem.setGlobalXfo(this.xfo);
      material.getParameter('Color').setValue(this.color);
      this.redo();
    }
  }

  update(updateData) {

    this.__used++;

    let realloc = false;
    if (this.__used >= this.line.getNumSegments()) {
        stroke.vertexCount = stroke.vertexCount + 100;
        this.line.setNumVertices(stroke.vertexCount);
        this.line.setNumSegments(stroke.vertexCount - 1);
        realloc = true;
    }

    this.line.vertices.setValue(this.__used, updateData.point);
    this.line.getVertexAttributes().lineThickness.setValue(this.__used, updateData.lineThickness);
    this.line.setSegment(this.__used - 1, this.__used - 1, this.__used);

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

export default class CreateFreehandLineTool extends CreateGeomTool {
  constructor(undoRedoManager) {
    super(undoRedoManager);

    this.cp = this.addParameter(new Visualive.ColorParameter('Line Color', new Visualive.Color(1, 0, 0, 1)));
    this.tp = this.addParameter(new Visualive.NumberParameter('Line Thickness', 0.01, [0, 0.1])); // 1cm.
    this.mp = this.addParameter(new Visualive.BooleanParameter('Modulate Thickness By Stroke Speed', false));
  }

  createStart(xfo) {
    this.xfo = new Visualive.Xfo(xfo.tr);
    const color = this.cp.getValue();
    const lineThickness = this.tp.getValue();
    const scene = viewport.getRenderer().getScene();
    const change = new CreateFreehandLineChange(scene.getRoot(), this.xfo, color, lineThickness);
    this.undoRedoManager.addChange(change);

    this.stage = 1;
    this.prevP = xfo.tr;
    this.length = 0;
  }

  createMove(pt) {
    const p = pt.subtract(this.xfo.tr);
    const vel = p.subtract(this.prevP).length();

    this.undoRedoManager.updateChange({ point: p });

    this.length += vel; 
    this.prevP = p;
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.undoRedoManager.undo();
    }
    this.stage = 0;
  }
}
