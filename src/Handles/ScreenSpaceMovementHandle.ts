import { Ray } from '@zeainc/zea-engine'
import Handle from './Handle.js'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange.js'
import UndoRedoManager from '../UndoRedo/UndoRedoManager.js'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   *
   * @param {string} name - The name value
   */
  constructor(name) {
    super(name)
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
    this.gizmoRay = new Ray()
    const ray = event.pointerRay
    const cameraXfo = event.viewport.getCamera().getParameter('GlobalXfo').getValue()
    this.gizmoRay.dir = cameraXfo.ori.getZaxis()
    const param = this.getTargetParam()
    const baseXfo = param.getValue()
    this.gizmoRay.start = baseXfo.tr
    const dist = ray.intersectRayPlane(this.gizmoRay)
    event.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
    return true
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent} event - The event param
   * @return {boolean} - The return value
   */
  handlePointerMove(event) {
    const ray = event.pointerRay
    const dist = ray.intersectRayPlane(this.gizmoRay)
    event.holdPos = ray.pointAtDist(dist)
    this.onDrag(event)
    return true
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event) {
    const ray = event.pointerRay
    if (ray) {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      event.releasePos = ray.pointAtDist(dist)
    }

    this.onDragEnd(event)
    return true
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos
    const param = this.getTargetParam()
    this.baseXfo = param.getValue()

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    newXfo.tr.addInPlace(dragVec)

    this.change.update({
      value: newXfo,
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

export default ScreenSpaceMovementHandle
export { ScreenSpaceMovementHandle }
