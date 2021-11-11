import { Vec3, Color, GeomItem, FatLinesMaterial, Lines } from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'

/**
 * Class representing a create freehand line change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateFreehandLineChange extends CreateGeomChange {
  /**
   * Create a create freehand line change.
   *
   * @param {TreeItem} parentItem - The parentItem value.
   * @param {Xfo} xfo - The xfo value.
   * @param {Color} color - The color value.
   * @param {number} thickness - The thickness value.
   */
  constructor(parentItem, xfo, color, thickness = 0.001) {
    super('CreateFreehandLine')

    this.used = 0
    this.vertexCount = 100

    this.line = new Lines()
    this.line.setNumVertices(this.vertexCount)
    this.line.setNumSegments(this.vertexCount - 1)
    this.line.getVertexAttribute('positions').setValue(0, new Vec3())
    this.line.lineThickness = thickness

    const material = new FatLinesMaterial('freeHandLine')
    material.lineThicknessParam.value = thickness
    if (color) {
      material.baseColorParam.value = color
    }

    this.geomItem = new GeomItem('freeHandLine', this.line, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates free hand line using the specified data.
   *
   * @param {object} updateData - The updateData param.
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

    this.line.getVertexAttribute('positions').setValue(this.used, updateData.point)
    // this.line.getVertexAttributes().lineThickness.setValue(this.used, updateData.lineThickness);
    this.line.setSegmentVertexIndices(this.used - 1, this.used - 1, this.used)

    if (realloc) {
      this.line.emit('geomDataTopologyChanged', {
        topologyChanged: true,
      })
    } else {
      this.line.emit('geomDataChanged', {
        topologyChanged: true,
      })
    }
    this.emit('updated', updateData)
  }

  /**
   * Serializes change as a JSON object.
   *
   * @param {object} context - The appData param.
   * @return {object} The return value.
   */
  toJSON(context) {
    const j = super.toJSON(context)
    j.lineThickness = this.line.lineThickness
    const material = this.geomItem.getParameter('Material').getValue()
    j.color = material.getParameter('BaseColor').getValue()
    return j
  }

  /**
   * Restores free hand line from a JSON object.
   *
   * @param {object} j - The j param.
   * @param {object} context - The appData param.
   */
  fromJSON(j, context) {
    // Need to set line thickness before the geom is added to the tree.
    if (j.lineThickness) {
      this.line.lineThickness = j.lineThickness
      // this.line.addVertexAttribute('lineThickness', Float32, 0.0);
      this.geomItem.getMaterial().getParameter('LineThickness').setValue(j.lineThickness)
    }

    if (j.color) {
      const color = new Color(0.7, 0.2, 0.2)
      color.fromJSON(j.color)
      this.geomItem.getMaterial().getParameter('BaseColor').setValue(color)
    }

    super.fromJSON(j, context)
  }
}

UndoRedoManager.registerChange('CreateFreehandLineChange', CreateFreehandLineChange)

export default CreateFreehandLineChange
export { CreateFreehandLineChange }
