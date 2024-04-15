import { ColorParameter, GeomItem, Quat, TreeItem, Vec3, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'
import CreateConeChange from './Change/CreateConeChange'
import { CreateGeomTool } from './CreateGeomTool'
import { ParameterValueChange, UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'

/**
 * Tool for creating a Cone geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateConeTool extends CreateGeomTool {
  xfo: Xfo
  invXfo: Xfo
  change: CreateConeChange
  radius: number
  height: number
  /**
   * Create a create cone tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super(appData, parentItem)
  }

  /**
   * Starts the creation of the geometry.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.change = new CreateConeChange(this.parentItem, xfo, this.colorParam.value)

    // During construction, make it note selectable.
    this.change.geomItem.setSelectable(false)

    UndoRedoManager.getInstance().addChange(this.change)

    this.stage = 1
    this.radius = 0.0
    this.height = 0.0
  }

  /**
   * Updates Cone geometry structural properties.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.stage == 1) {
      const vec = pt.subtract(this.xfo.tr)
      // TODO: Rotate the cone so the base is aligned with the vector towards the controller
      this.radius = vec.length()
      this.change.update({ radius: this.radius })
    } else {
      this.height = this.invXfo.transformVec3(pt).y
      this.change.update({ height: this.height })
    }
  }

  /**
   * Finishes the creation of the Cone.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.radius == 0) {
      UndoRedoManager.getInstance().cancel()
      this.stage = 0
      this.emit('actionFinished')
    }
    if (this.stage == 1) {
      this.stage = 2

      const quat = new Quat()
      quat.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat)
      this.constructionPlane.tr = pt
      this.invXfo = this.constructionPlane.inverse()
    } else if (this.stage == 2) {
      this.stage = 0

      // After completion, make it selectable.
      this.change.geomItem.setSelectable(true)

      this.emit('actionFinished')
    }
  }
}

export default CreateConeTool
export { CreateConeTool }
