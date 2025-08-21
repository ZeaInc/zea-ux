import CreateGeomTool from './CreateGeomTool'
import CreateRectChange from './Change/CreateRectChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'
import { TreeItem, Vec3, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'

/**
 * Tool for creating a rectangle geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateRectTool extends CreateGeomTool {
  change: CreateRectChange
  xfo: Xfo
  invXfo: Xfo
  size: number
  /**
   * Create a create rect tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super(appData, parentItem)
  }

  /**
   * Starts the creation of a rectangle geometry.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    this.change = new CreateRectChange(this.parentItem, xfo, this.colorParam.value)

    // During construction, make it note selectable.
    this.change.geomItem.pickableParam.value = false

    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.stage = 1
    this.size = 0.0
  }

  /**
   * Updated the rectangle geometry structural properties.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.stage == 1) {
      const delta = this.invXfo.transformVec3(pt)

      this.size = Math.min(Math.abs(delta.x), Math.abs(delta.y))
      const xfo = this.xfo.clone()
      xfo.tr.addInPlace(xfo.ori.rotateVec3(delta.scale(0.5)))

      this.change.update({
        size: [Math.abs(delta.x), Math.abs(delta.y)],
        xfo,
      })
    }
  }

  /**
   * Finishes the creation of a rectangle geometry.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.size == 0) {
      UndoRedoManager.getInstance().cancel()
    }

    // After completion, make it selectable.
    this.change.geomItem.pickableParam.value = true
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateRectTool
export { CreateRectTool }
