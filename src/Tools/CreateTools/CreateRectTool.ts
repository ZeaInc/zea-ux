import CreateGeomTool from './CreateGeomTool'
import CreateRectChange from './Change/CreateRectChange'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'
import { Vec3, Xfo } from '@zeainc/zea-engine'

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
  _size: number
  /**
   * Create a create rect tool.
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)
  }

  /**
   * Starts the creation of a rectangle geometry.
   *
   * @param xfo - The xfo param.
   */
  createStart(xfo: Xfo): void {
    this.change = new CreateRectChange(this.parentItem, xfo)

    // During construction, make it note selectable.
    this.change.geomItem.setSelectable(false)

    UndoRedoManager.getInstance().addChange(this.change)

    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.stage = 1
    this._size = 0.0
  }

  /**
   * Updated the rectangle geometry structural properties.
   *
   * @param pt - The pt param.
   */
  createMove(pt: Vec3): void {
    if (this.stage == 1) {
      const delta = this.invXfo.transformVec3(pt)

      ;(this._size = Math.abs(delta.x)), Math.abs(delta.y)

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
   * Finishes the creation of a rectangle geometry.
   *
   * @param pt - The pt param.
   */
  createRelease(pt: Vec3): void {
    if (this._size == 0) {
      UndoRedoManager.getInstance().cancel()
    }

    // After completion, make it selectable.
    this.change.geomItem.setSelectable(true)
    this.stage = 0
    this.emit('actionFinished')
  }
}

export default CreateRectTool
export { CreateRectTool }
