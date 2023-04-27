import { Vec3, Color, GeomItem, LinesMaterial, Lines, Vec3Attribute, TreeItem, Xfo } from '@zeainc/zea-engine'
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
  vertexCount = 100
  used = 0
  line: Lines = new Lines()
  /**
   * Create a create freehand line change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   * @param color - The color value.
   * @param thickness - The thickness value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color, thickness = 0.001) {
    super('CreateFreehandLine')

    this.line.setNumVertices(this.vertexCount)
    this.line.setNumSegments(this.vertexCount - 1)
    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(0, new Vec3())

    // TODO: added lineThicknessParam to LinesMaterial
    const material = new LinesMaterial('freeHandLine')
    if (color) {
      material.baseColorParam.value = color
    }
    // if (material.lineThicknessParam) {
    //   material.lineThicknessParam.value = thickness
    // }

    this.geomItem = new GeomItem('freeHandLine', this.line, material)

    if (parentItem && xfo) {
      this.setParentAndXfo(parentItem, xfo)
    }
  }

  /**
   * Updates free hand line using the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    // console.log("update:", this.used)

    this.used++

    let realloc = false
    if (this.used >= this.line.getNumSegments()) {
      this.vertexCount = this.vertexCount + 100
      this.line.setNumVertices(this.vertexCount)
      this.line.setNumSegments(this.vertexCount - 1)
      realloc = true
    }
    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(this.used, updateData.point)
    this.line.setSegmentVertexIndices(this.used - 1, this.used - 1, this.used)
    this.line.setBoundingBoxDirty()

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
   * @param context - The appData param.
   * @return {object} The return value.
   */
  toJSON(context: Record<any, any>): Record<string, any> {
    const j = super.toJSON(context)
    const material = <LinesMaterial>this.geomItem.materialParam.value
    // j.lineThickness = material.lineThicknessParam.value
    j.color = material.baseColorParam.value
    return j
  }

  /**
   * Restores free hand line from a JSON object.
   *
   * @param j - The j param.
   * @param context - The appData param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    // Need to set line thickness before the geom is added to the tree.
    // if (j.lineThickness) {
    //   const material = <LinesMaterial>this.geomItem.materialParam.value
    //   material.lineThicknessParam.value = j.lineThickness
    // }

    if (j.color) {
      const color = new Color(0.7, 0.2, 0.2)
      color.fromJSON(j.color)
      const material = <LinesMaterial>this.geomItem.materialParam.value
      material.baseColorParam.value = color
    }

    super.fromJSON(j, context)
  }
}

UndoRedoManager.registerChange('CreateFreehandLineChange', CreateFreehandLineChange)

export default CreateFreehandLineChange
export { CreateFreehandLineChange }
