import CreateCircleChange from './Change/CreateCircleChange'
import CreateGeomTool from './CreateGeomTool'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'
import { Color, GeomItem, Material, TreeItem, Vec3, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'

/**
 * Tool for creating a circle geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateCircleTool extends CreateGeomTool {
  change: CreateCircleChange
  xfo: Xfo
  radius: number
  /**
   * Create a create circle tool.
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
    this.change = new CreateCircleChange(this.parentItem, xfo, this.colorParam.value)
    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.stage = 1
    this.radius = 0.0
  }

  /**
   * Updates Circle geometry radius.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    const xfo = this.constructionPlane.clone()
    xfo.tr = xfo.tr.lerp(pt, 0.5)
    this.radius = pt.distanceTo(this.xfo.tr) / 2
    this.change.update({ radius: this.radius, xfo })
    this.appData.renderer.forceRender()
  }

  /**
   * Finishes geometry creation.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.radius == 0) {
      UndoRedoManager.getInstance().cancel()
    }

    // After completion, make it selectable.
    this.change.geomItem.pickableParam.value = true

    this.emit('actionFinished')
    this.change = null
    this.stage = 0
  }
}

export default CreateCircleTool
export { CreateCircleTool }
