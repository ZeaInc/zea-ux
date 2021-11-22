import { Parameter, Ray, Vec3, Xfo } from '@zeainc/zea-engine'
import Handle from './Handle.js'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange.js'
import UndoRedoManager from '../UndoRedo/UndoRedoManager.js'
import { ZeaMouseEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaMouseEvent'
import { ZeaTouchEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaTouchEvent'
import { ZeaPointerEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaPointerEvent'
import { getPointerRay } from '../utility.js'

/**
 * Class representing a planar movement scene widget.
 *
 * @extends Handle
 */
class ScreenSpaceMovementHandle extends Handle {
  param: Parameter<unknown>
  change: ParameterValueChange
  grabPos: Vec3
  baseXfo: Xfo
  /**
   * Create a planar movement scene widget.
   *
   * @param {string} name - The name value
   */
  constructor(name?: string) {
    super(name)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true): void {
    this.param = param
    if (track) {
      const __updateGizmo = () => {
        this.globalXfoParam.setValue(param.getValue())
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
  getTargetParam(): Parameter<unknown> {
    return this.param ? this.param : this.globalXfoParam
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerDown(event: ZeaMouseEvent) {
    this.gizmoRay = new Ray()
    const ray = getPointerRay(event)
    const cameraXfo = event.viewport.getCamera().globalXfoParam.value
    this.gizmoRay.dir = cameraXfo.ori.getZaxis()
    const param = this.getTargetParam()
    const baseXfo = <Xfo>param.value
    this.gizmoRay.start = baseXfo.tr
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent} event - The event param
   * @return {boolean} - The return value
   */
  handlePointerMove(event: ZeaPointerEvent) {
    const ray = getPointerRay(event)
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.holdPos = ray.pointAtDist(dist)
    this.onDrag(event)
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event: ZeaPointerEvent) {
    const ray = getPointerRay(event)
    if (ray) {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      this.releasePos = ray.pointAtDist(dist)
    }

    this.onDragEnd(event)
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event: ZeaPointerEvent) {
    this.grabPos = this.grabPos
    const param = this.getTargetParam()
    this.baseXfo = <Xfo>param.value

    this.change = new ParameterValueChange(param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event: ZeaPointerEvent) {
    const dragVec = this.holdPos.subtract(this.grabPos)

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
  onDragEnd(event: ZeaPointerEvent) {
    this.change = null
  }
}

export default ScreenSpaceMovementHandle
export { ScreenSpaceMovementHandle }
