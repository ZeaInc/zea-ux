import {
  Vec3,
  Color,
  BooleanParameter,
  GeomItem,
  Material,
  Lines,
} from '@zeainc/zea-engine'

import UndoRedoManager from '../../undoredo/UndoRedoManager.js'
import { CreateGeomChange } from './CreateGeomTool.js'
import CreateLineTool from './CreateLineTool.js'

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
    super('Create Freehand Line')

    this.used = 0
    this.vertexCount = 100

    this.line = new Lines()
    this.line.setNumVertices(this.vertexCount)
    this.line.setNumSegments(this.vertexCount - 1)
    this.line.vertices.setValue(0, new Vec3())

    // const material = new Material('freeHandLine', 'LinesShader');
    // this.line.lineThickness = 0.5;
    // const material = new Material('freeHandLine', 'LinesShader');
    const material = new Material('freeHandLine', 'FatLinesShader')

    this.geomItem = new GeomItem('freeHandLine')
    this.geomItem.setGeometry(this.line)
    this.geomItem.setMaterial(material)

    if (color) {
      material.getParameter('Color').setValue(color)
    }

    if (thickness) {
      this.line.lineThickness = thickness
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * The update method.
   * @param {any} updateData - The updateData param.
   */
  update(updateData) {
    // console.log("update:", this.used)

    this.used++

    let realloc = false
    if (this.used >= this.line.getNumSegments()) {
      this.vertexCount = this.vertexCount + 100
      this.line.setNumVertices(this.vertexCount)
      this.line.setNumSegments(this.vertexCount - 1)
      realloc = true
    }

    this.line.vertices.setValue(this.used, updateData.point)
    // this.line.getVertexAttributes().lineThickness.setValue(this.used, updateData.lineThickness);
    this.line.setSegment(this.used - 1, this.used - 1, this.used)

    if (realloc) {
      this.line.geomDataTopologyChanged.emit({
        indicesChanged: true,
      })
    } else {
      this.line.geomDataChanged.emit({
        indicesChanged: true,
      })
    }
    this.updated.emit(updateData)
  }

  /**
   * The toJSON method.
   * @param {any} appData - The appData param.
   * @return {any} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context)
    j.lineThickness = this.line.lineThickness
    j.color = this.geomItem.getMaterial().getParameter('Color').getValue()
    return j
  }

  /**
   * The fromJSON method.
   * @param {any} j - The j param.
   * @param {any} appData - The appData param.
   */
  fromJSON(j, context) {
    // Need to set line thickness before the geom is added to the tree.
    if (j.lineThickness) {
      this.line.lineThickness = j.lineThickness
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
    }

    const color = new Color(0.7, 0.2, 0.2)
    if (j.color) {
      color.fromJSON(j.color)
    }
    this.geomItem.getMaterial().getParameter('Color').setValue(color)

    super.fromJSON(j, context)
  }
}
UndoRedoManager.registerChange(
  'CreateFreehandLineChange',
  CreateFreehandLineChange
)

/**
 * Class representing a create freehand line tool.
 * @extends CreateLineTool
 */
class CreateFreehandLineTool extends CreateLineTool {
  /**
   * Create a create freehand line tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.mp = this.addParameter(
      new BooleanParameter('Modulate Thickness By Stroke Speed', false)
    )
  }

  /**
   * The createStart method.
   * @param {any} xfo - The xfo param.
   * @param {any} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    const color = this.cp.getValue()
    const lineThickness = this.tp.getValue()
    this.change = new CreateFreehandLineChange(
      parentItem,
      xfo,
      color,
      lineThickness
    )
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo
    this.invxfo = xfo.inverse()
    this.stage = 1
    this.prevP = xfo.tr
    this.length = 0
  }

  /**
   * The createMove method.
   * @param {any} pt - The pt param.
   */
  createMove(pt) {
    const p = this.invxfo.transformVec3(pt)
    const delta = p.subtract(this.prevP).length()
    if (delta > 0.001) {
      this.change.update({
        point: p,
      })
    }

    this.length += delta
    this.prevP = p
  }

  /**
   * The createRelease method.
   * @param {any} pt - The pt param.
   */
  createRelease(pt) {
    if (this.length == 0) {
      this.appData.undoRedoManager.undo(false)
    }
    this.stage = 0
    this.emit('actionFinished')
  }
}
export { CreateFreehandLineTool }
