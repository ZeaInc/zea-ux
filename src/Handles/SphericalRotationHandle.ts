import {
  Color,
  Xfo,
  GeomItem,
  Material,
  Sphere,
  Vec3,
  Parameter,
  XfoParameter,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'
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
  param: Parameter<unknown>
  radius: number
  vec0: Vec3
  baseXfo: Xfo
  deltaXfo: Xfo
  offsetXfo: Xfo
  change: ParameterValueChange
  maskMat: Material

  /**
   * Create an axial rotation scene widget.
   *
   * @param name - The name value.
   * @param radius - The radius value.
   * @param color - The color value.
   */
  constructor(name: string, radius: number, color = new Color()) {
    super(name)

    this.radius = radius

    this.colorParam.value = color
    this.maskMat = new Material('mask', 'HandleShader')
    this.maskMat.getParameter('BaseColor').value = color
    this.maskMat.getParameter('MaintainScreenSize').value = 1
    this.maskMat.getParameter('Overlay').value = 0.9

    const maskGeom = new Sphere(radius, 64)
    const maskGeomItem = new GeomItem('mask', maskGeom, this.maskMat)

    this.colorParam.on('valueChanged', () => {
      this.maskMat.getParameter('BaseColor').value = this.colorParam.getValue()
    })

    this.addChild(maskGeomItem)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param param - The video param.
   * @param track - The track param.
   */
  setTargetParam(param: XfoParameter, track = true): void {
    this.param = param
    if (track) {
      const __updateGizmo = () => {
        this.globalXfoParam.value = param.getValue()
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
  getTargetParam(): XfoParameter | Parameter<unknown> {
    return this.param ? this.param : this.globalXfoParam
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerDown(event: ZeaMouseEvent): boolean {
    // const xfo = this.globalXfoParam.value;
    // this.sphere = {
    //   tr: xfo,
    //   radius: this.radius,
    // };
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // this.grabPos = event.mouseRay.pointAtDist(dist);
    // this.onDragStart(event);
    return true
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param event - The event param
   * @return {boolean} - The return value
   */
  handlePointerMove(event: ZeaMouseEvent): void {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // this.holdPos = event.mouseRay.pointAtDist(dist);
    // this.onDrag(event);
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event: ZeaMouseEvent): void {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // this.releasePos = event.mouseRay.pointAtDist(dist);
    // this.onDragEnd(event);
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.baseXfo = this.globalXfoParam.value
    this.baseXfo.sc.set(1, 1, 1)
    this.deltaXfo = new Xfo()
    const param = this.getTargetParam()
    this.offsetXfo = this.baseXfo.inverse().multiply(<Xfo>param.value)

    this.vec0 = this.grabPos.subtract(this.baseXfo.tr)
    this.vec0.normalizeInPlace()

    // Hilight the material.
    this.colorParam.value = new Color(1, 1, 1)

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    const vec1 = this.holdPos.subtract(this.baseXfo.tr)
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
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    this.change = null
  }
}

export default SphericalRotationHandle
export { SphericalRotationHandle }
