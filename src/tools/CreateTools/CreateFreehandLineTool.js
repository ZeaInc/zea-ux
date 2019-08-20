import UndoRedoManager from '../../undoredo/UndoRedoManager.js';
import { CreateGeomChange } from './CreateGeomTool.js';
import CreateLineTool from './CreateLineTool.js';

/**
 * Class representing a create freehand line change.
 * @extends CreateGeomChange
 */
class CreateFreehandLineChange extends CreateGeomChange {
  /**
   * Create a create freehand line change.
   * @param {any} parentItem - The parentItem value.
   * @param {any} xfo - The xfo value.
   * @param {any} color - The color value.
   * @param {any} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness) {
    super('Create Freehand Line');

    this.used = 0;
    this.vertexCount = 100;

    this.line = new Visualive.Lines();
    this.line.setNumVertices(this.vertexCount);
    this.line.setNumSegments(this.vertexCount - 1);
    this.line.vertices.setValue(0, new Visualive.Vec3());

    // const material = new Visualive.Material('freeHandLine', 'LinesShader');
    // this.line.lineThickness = 0.5;
    // const material = new Visualive.Material('freeHandLine', 'LinesShader');
    const material = new Visualive.Material('freeHandLine', 'FatLinesShader');

    this.geomItem = new Visualive.GeomItem('freeHandLine');
    this.geomItem.setGeometry(this.line);
    this.geomItem.setMaterial(material);

    if (color) {
      material.getParameter('Color').setValue(color);
    }

    if (thickness) {
      this.line.lineThickness = thickness;
      // this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);
    }

    if (parentItem && xfo) {
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
        indicesChanged: true,
      });
    } else {
      this.line.geomDataChanged.emit({
        indicesChanged: true,
      });
    }
    this.updated.emit(updateData);
  }

  toJSON(appData) {
    const j = super.toJSON();
    j.lineThickness = this.line.lineThickness;
    j.color = this.geomItem
      .getMaterial()
      .getParameter('Color')
      .getValue();
    return j;
  }

  fromJSON(j, appData) {
    // Need to set line thickness before the geom is added to the tree.
    if (j.lineThickness) {
      this.line.lineThickness = j.lineThickness;
      // this.line.addVertexAttribute('lineThickness', Visualive.Float32, 0.0);
    }

    const color = new Visualive.Color(0.7, 0.2, 0.2);
    if (j.color) {
      color.fromJSON(j.color);
    }
    this.geomItem
      .getMaterial()
      .getParameter('Color')
      .setValue(color);

    super.fromJSON(j, appData);
  }
}
UndoRedoManager.registerChange(
  'CreateFreehandLineChange',
  CreateFreehandLineChange
);

class CreateFreehandLineTool extends CreateLineTool {
  constructor(appData) {
    super(appData);

    this.mp = this.addParameter(
      new Visualive.BooleanParameter(
        'Modulate Thickness By Stroke Speed',
        false
      )
    );
  }

  createStart(xfo, parentItem) {
    const color = this.cp.getValue();
    const lineThickness = this.tp.getValue();
    this.change = new CreateFreehandLineChange(
      parentItem,
      xfo,
      color,
      lineThickness
    );
    this.appData.undoRedoManager.addChange(this.change);

    this.xfo = xfo;
    this.invxfo = xfo.inverse();
    this.stage = 1;
    this.prevP = xfo.tr;
    this.length = 0;
  }

  createMove(pt) {
    const p = this.invxfo.transformVec3(pt);
    const delta = p.subtract(this.prevP).length();
    if (delta > 0.001) {
      this.change.update({
        point: p,
      });
    }

    this.length += delta;
    this.prevP = p;
  }

  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false);
    }
    this.stage = 0;
    this.actionFinished.emit();
  }
}
export { CreateFreehandLineTool };
