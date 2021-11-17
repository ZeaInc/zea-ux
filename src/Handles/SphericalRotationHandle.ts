import { Color, Xfo, GeomItem, Material, Sphere } from '@zeainc/zea-engine'
import Handle from './Handle'
import './Shaders/HandleShader'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { ParameterValueChange } from '../UndoRedo/Changes/ParameterValueChange'

/**
 * Class representing an axial rotation scene widget.
 *
 * @extends Handle
 */
class SphericalRotationHandle extends Handle {
  param
  radius
  maskMat
  baseXfo
  deltaXfo
  change
  vec0
  offsetXfo
  /**
   * Create an axial rotation scene widget.
   *
   * @param {string} name - The name value.
   * @param {number} radius - The radius value.
   * @param {Color} color - The color value.
   */
  constructor(name, radius, color = new Color()) {
    super(name)

    this.radius = radius

    this.colorParam.setValue(color)
    this.maskMat = new Material('mask', 'HandleShader')
    this.maskMat.getParameter('BaseColor').setValue(color)
    this.maskMat.getParameter('MaintainScreenSize').setValue(1)
    this.maskMat.getParameter('Overlay').setValue(0.9)

    const maskGeom = new Sphere(radius, 64)
    const maskGeomItem = new GeomItem('mask', maskGeom, this.maskMat)

    this.colorParam.on('valueChanged', () => {
      this.maskMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
    })

    this.addChild(maskGeomItem)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param
    if (track) {
      const __updateGizmo = () => {
        this.getParameter('GlobalXfo').setValue(param.getValue())
      }
      __updateGizmo()
      param.on('valueChanged', __updateGizmo)
    }
  }

  /**
   * Returns target's global xfo parameter.
   *
   * @return {Parameter} - returns handle's target global Xfo.
   */
  getTargetParam() {
    return this.param ? this.param : this.getParameter('GlobalXfo')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerDown(event) {
    // const xfo = this.getParameter('GlobalXfo').getValue();
    // this.sphere = {
    //   tr: xfo,
    //   radius: this.radius,
    // };
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.grabPos = event.mouseRay.pointAtDist(dist);
    // this.onDragStart(event);
    return true
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent} event - The event param
   * @return {boolean} - The return value
   */
  handlePointerMove(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.holdPos = event.mouseRay.pointAtDist(dist);
    // this.onDrag(event);
    return true
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.releasePos = event.mouseRay.pointAtDist(dist);
    // this.onDragEnd(event);
    return true
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.baseXfo = this.getParameter('GlobalXfo').getValue()
    this.baseXfo.sc.set(1, 1, 1)
    this.deltaXfo = new Xfo()
    const param = this.getTargetParam()
    this.offsetXfo = this.baseXfo.inverse().multiply(param.getValue())

    this.vec0 = event.grabPos.subtract(this.baseXfo.tr)
    this.vec0.normalizeInPlace()

    // Hilight the material.
    this.colorParam.setValue(new Color(1, 1, 1))

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr)
    vec1.normalizeInPlace()
    const modulator = 1
    const angle = this.vec0.angleTo(vec1) * modulator
    const axis = this.vec0.cross(vec1).normalize()

    this.deltaXfo.ori.setFromAxisAndAngle(axis, angle)

    const newXfo = this.baseXfo.multiply(this.deltaXfo)
    const value = newXfo.multiply(this.offsetXfo)

    this.change.update({
      value,
    })
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
  }
}

export default SphericalRotationHandle
export { SphericalRotationHandle }
