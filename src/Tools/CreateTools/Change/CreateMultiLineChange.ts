import { Color, GeomItem, LinesMaterial, Lines, Vec3, Vec3Attribute, TreeItem, Xfo } from '@zeainc/zea-engine'
import UndoRedoManager from '../../../UndoRedo/UndoRedoManager'
import CreateGeomChange from './CreateGeomChange'
import { CustomGeom } from '../CustomGeom'

/**
 * Class representing a create line change.
 *
 * **Events**
 * * **updated:** Triggered when the change is updated
 *
 * @extends CreateGeomChange
 */
class CreateMultiLineChange extends CreateGeomChange {
  line: Lines
  stage: number
  vertices: Vec3[] = []

  /**
   * Create a create line change.
   *
   * @param parentItem - The parentItem value.
   * @param xfo - The xfo value.
   * @param color - The color value.
   * @param thickness - The thickness value.
   */
  constructor(parentItem: TreeItem, xfo: Xfo, color: Color) {
    super('Create Line', parentItem, xfo, color)
    if (this.parentItem) {
      this.createGeomItem()
    }
  }

  protected createGeomItem() {
    this.line = new Lines()
    const material = new LinesMaterial('Line')
    material.baseColorParam.value = this.color
    this.geomItem = new CustomGeom('Line', this.line, material, this.xfo)
    if (this.parentItem) {
      this.parentItem.addChild(this.geomItem)
    }
    this.geomItem.pickableParam.value = false // At the conclusion of creation, we set selectable to true.
    this.stage = 1
  }

  public addVertex(pt: Vec3) {
    if (!this.vertices) {
      this.vertices = []
    }

    this.vertices.push(pt)
    const segmentIndex = this.vertices.length - 1

    this.line.setNumVertices(this.vertices.length + 1)
    this.line.setNumSegments(this.vertices.length)

    const positions = <Vec3Attribute>this.line.getVertexAttribute('positions')
    positions.setValue(segmentIndex, pt)
    this.line.setSegmentVertexIndices(segmentIndex, segmentIndex, this.vertices.length)
  }

  /**
   * Updates Line using the specified data.
   *
   * @param updateData - The updateData param.
   */
  update(updateData: Record<any, any>): void {
    if (this.stage === 0) return

    const looseVertex = updateData.vertices.pop()

    this.vertices = []

    for (const vertex of updateData.vertices) {
      this.addVertex(vertex)
    }

    if (this.vertices.length && looseVertex) {
      this.line.positions.setValue(this.vertices.length, looseVertex)
      this.line.setBoundingBoxDirty()
      this.line.emit('geomDataChanged')
    }

    if (updateData.shouldFinish) {
      this.line.setNumVertices(this.vertices.length)
      this.line.setNumSegments(this.vertices.length - 1)
      this.stage = 0
      this.emit('actionFinished')
    } else {
      this.emit('updated', updateData)
    }
  }

  /**
   * Restores line geometry using a JSON object.
   *
   * @param j - The j param.
   * @param context - The context param.
   */
  fromJSON(j: Record<any, any>, context: Record<any, any>): void {
    super.fromJSON(j, context)
  }
}

UndoRedoManager.registerChange('CreateMultiLineChange', CreateMultiLineChange)

export default CreateMultiLineChange
export { CreateMultiLineChange }
