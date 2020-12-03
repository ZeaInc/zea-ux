import { Quat, Vec3 } from '@zeainc/zea-engine'
import CreateConeChange from './Change/CreateConeChange'
import { CreateGeomTool } from './CreateGeomTool'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Tool for creating a Cone geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateConeTool extends CreateGeomTool {
  /**
   * Create a create cone tool.
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * Starts the creation of the geometry.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    this.xfo = xfo
    this.invXfo = xfo.inverse()
    this.change = new CreateConeChange(this.parentItem, xfo)
    UndoRedoManager.getInstance().addChange(this.change)

    this.stage = 1
    this._radius = 0.0
    this._height = 0.0
  }

  /**
   * Updates Cone geometry structural properties.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const vec = pt.subtract(this.xfo.tr)
      // TODO: Rotate the cone so the base is aligned with the vector towards the controller
      this._radius = vec.length()
      this.change.update({ radius: this._radius })
    } else {
      this._height = this.invXfo.transformVec3(pt).y
      this.change.update({ height: this._height })
    }
  }

  /**
   * Finishes the creation of the Cone.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    if (this._radius == 0 || this._height == 0) {
      UndoRedoManager.getInstance().cancel()
      this.stage = 0
      this.emit('actionFinished')
    }
    if (this.stage == 1) {
      console.log('Going in boy')
      this.stage = 2

      const quat = new Quat()
      quat.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat)
      this.constructionPlane.tr = pt
      this.invXfo = this.constructionPlane.inverse()
    } else if (this.stage == 2) {
      this.stage = 0
      this.emit('actionFinished')
    }
  }
}

export default CreateConeTool
export { CreateConeTool }
