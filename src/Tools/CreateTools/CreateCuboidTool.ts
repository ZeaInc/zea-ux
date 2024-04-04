import { ColorParameter, Quat, TreeItem, Vec3, Xfo, ZeaPointerEvent } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateCuboidChange from './Change/CreateCuboidChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'

/**
 * Tool for creating Cuboid geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateCuboidTool extends CreateGeomTool {
  change: CreateCuboidChange
  xfo: Xfo
  invXfo: Xfo
  height: number
  pt1: Vec3
  /**
   * Create a create cuboid tool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
  }

  /**
   * Starts the creation of the cuboid.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    this.change = new CreateCuboidChange(this.parentItem, xfo, this.colorParam.value)

    // During construction, make it note selectable.
    this.change.geomItem.setSelectable(false)

    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.stage = 1
    this.height = 0.0
  }

  /**
   * Updates cuboid structural properties.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.stage == 1) {
      const delta = this.invXfo.transformVec3(pt)

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      })
    } else {
      const vec = this.invXfo.transformVec3(pt)
      this.change.update({ height: vec.y })
    }
  }

  /**
   * Finishes the creation of the cuboid.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    if (this.stage == 1) {
      this.stage = 2
      this.pt1 = pt

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

export { CreateCuboidTool }
