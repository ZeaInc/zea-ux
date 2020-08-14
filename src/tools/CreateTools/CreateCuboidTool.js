import { Quat, Vec3 } from '@zeainc/zea-engine'
import CreateGeomTool from './CreateGeomTool'
import CreateCuboidChange from './Change/CreateCuboidChange'

/**
 * Tool for creating Cuboid geometry.
 *
 * **Events**
 * * **actionFinished:** Triggered when the creation of the geometry is completed.
 *
 * @extends CreateGeomTool
 */
class CreateCuboidTool extends CreateGeomTool {
  /**
   * Create a create cuboid tool.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)
  }

  /**
   * Starts the creation of the cuboid.
   *
   * @param {Xfo} xfo - The xfo param.
   * @param {TreeItem} parentItem - The parentItem param.
   */
  createStart(xfo, parentItem) {
    this.change = new CreateCuboidChange(parentItem, xfo)
    this.appData.undoRedoManager.addChange(this.change)

    this.xfo = xfo
    this.invxfo = xfo.inverse()
    this.stage = 1
    this._height = 0.0
  }

  /**
   * Updates cuboid structural properties.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    if (this.stage == 1) {
      const delta = this.invxfo.transformVec3(pt)

      // const delta = pt.subtract(this.xfo.tr)
      this.change.update({
        baseSize: [Math.abs(delta.x), Math.abs(delta.y)],
        tr: this.xfo.tr.add(delta.scale(0.5)),
      })
    } else {
      const vec = this.invxfo.transformVec3(pt)
      this.change.update({ height: vec.y })
    }
  }

  /**
   * Finishes the creation of the cuboid.
   *
   * @param {Vec3} pt - The pt param.
   * @param {GLViewport} viewport - The viewport param.
   */
  createRelease(pt, viewport) {
    if (this.stage == 1) {
      this.stage = 2
      this.pt1 = pt

      const quat = new Quat()
      quat.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      this.constructionPlane.ori = this.constructionPlane.ori.multiply(quat)
      this.constructionPlane.tr = pt
      this.invxfo = this.constructionPlane.inverse()
    } else if (this.stage == 2) {
      this.stage = 0
      this.emit('actionFinished')
    }
  }
}

export { CreateCuboidTool }
