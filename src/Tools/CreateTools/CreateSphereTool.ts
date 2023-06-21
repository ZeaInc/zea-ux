import CreateGeomTool from './CreateGeomTool'
import CreateSphereChange from './Change/CreateSphereChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'
import { Vec3, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'

/**
 * Tool for creating Sphere geometries.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateSphereTool extends CreateGeomTool {
  change: CreateSphereChange
  xfo: Xfo
  radius: number
  /**
   * Create a create sphere tool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
  }

  /**
   * Starts the creation of the sphere geometry.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    this.change = new CreateSphereChange(this.parentItem, xfo, this.colorParam.getValue())

    // During construction, make it note selectable.
    this.change.geomItem.setSelectable(false)

    UndoRedoManager.getInstance().addChange(this.change)
    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * Updates the sphere geometry structural properties.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    const xfo = this.constructionPlane.clone()
    xfo.tr = xfo.tr.lerp(pt, 0.5)
    this.radius = pt.distanceTo(this.xfo.tr) / 2
    this.change.update({ radius: this.radius, xfo })
  }

  /**
   * Finishes the creation of the sphere geometry.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.radius == 0) {
      UndoRedoManager.getInstance().cancel()
    }
    // After completion, make it selectable.
    this.change.geomItem.setSelectable(true)
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateSphereTool
export { CreateSphereTool }
