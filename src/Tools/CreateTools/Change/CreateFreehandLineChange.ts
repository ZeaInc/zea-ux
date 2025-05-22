import {
  Vec3,
  Color,
  GeomItem,
  LinesMaterial,
  Lines,
  Vec3Attribute,
  TreeItem,
  Xfo,
  Material,
  FatLinesMaterial,
} from '@zeainc/zea-engine'
import { UndoRedoManager } from '../../../UndoRedo/index'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create freehand line change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateFreehandLineChange extends CreateGeomChange {
  vertexCount: number
  used: number
  line: Lines
  /**
   * Create a create freehand line change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   * @param color - The color value.
   * @param thickness - The thickness value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color, public thickness: number = 0.0) {
    super('CreateFreehandLine', parentItem, xfo, color)
    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.vertexCount = 100
    this.used = 0
    this.line = new Lines()
    this.line.setNumVertices(this.vertexCount)
    this.line.setNumSegments(this.vertexCount - 1)
    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(0, new Vec3())

    let material: Material
    if (this.thickness > 0) {
      const fatLinesMaterial = new FatLinesMaterial('freeHandLine')
      fatLinesMaterial.baseColorParam.value = this.color
      fatLinesMaterial.lineThicknessParam.value = this.thickness
      material = fatLinesMaterial
    } else {
      const linesMaterial = new LinesMaterial('freeHandLine')
      linesMaterial.baseColorParam.value = this.color
      material = linesMaterial
    }
    this.geomItem = new CustomGeom('freeHandLine', this.line, material, this.xfo)
    this.geomItem.pickableParam.value = false // At the conclusion of creation, we set selectable to true.
    if (this.parentItem) {
      this.parentItem.addChild(this.geomItem)
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
    j.lineThickness = this.thickness
    j.color = this.color
    return j
  }

  /**
   * Restores free hand line from a JSON object.
   *
   * @param j - The j param.
   * @param context - The appData param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    if (j.lineThickness) {
      this.thickness = j.lineThickness
    }
    super.fromJSON(j, context)
  }
}

UndoRedoManager.registerChange('CreateFreehandLineChange', CreateFreehandLineChange)

export default CreateFreehandLineChange
export { CreateFreehandLineChange }
