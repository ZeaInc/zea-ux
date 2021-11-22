import { Vec3 } from '@zeainc/zea-engine'
import { XRControllerEvent } from '@zeainc/zea-engine/dist/Utilities/Events/XRControllerEvent'
import { ZeaMouseEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaMouseEvent'
import { ZeaPointerEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaPointerEvent'
import { ZeaTouchEvent } from '@zeainc/zea-engine/dist/Utilities/Events/ZeaTouchEvent'
import { getPointerRay } from '../utility'
import Handle from './Handle'

/**
 * Class representing a base linear movement scene widget.
 *
 * @extends Handle
 */
class BaseLinearMovementHandle extends Handle {
  grabDist: number
  grabPos: Vec3
  /**
   * Create base linear movement scene widget.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerDown(event: ZeaPointerEvent) {
    this.gizmoRay = this.getManipulationPlane()
    const ray = getPointerRay(event)
    this.grabDist = ray.intersectRayVector(this.gizmoRay)[1]
    const grabPos = this.gizmoRay.pointAtDist(this.grabDist)
    this.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param
   */
  handlePointerMove(event: ZeaPointerEvent) {
    const ray = getPointerRay(event)
    const dist = ray.intersectRayVector(this.gizmoRay)[1]
    this.holdPos = this.gizmoRay.pointAtDist(dist)
    this.holdDist = dist
    this.value = dist
    this.delta = dist - this.grabDist
    this.onDrag(event)
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event: ZeaPointerEvent) {
    const ray = getPointerRay(event)
    if (ray) {
      const dist = ray.intersectRayVector(this.gizmoRay)[1]
      const releasePos = this.gizmoRay.pointAtDist(dist)
      this.releasePos = releasePos
    }

    this.onDragEnd(event)
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event: XRControllerEvent) {
    this.gizmoRay = this.getManipulationPlane()

    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo()
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir)
    this.grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist))

    //this.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRPoseChanged(event: XRControllerEvent) {
    const xfo = this.activeController.getTipXfo()
    const dist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir)
    this.holdPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist))
    this.value = dist
    this.delta = dist - this.grabDist
    this.onDrag(event)
  }

  /**
   * Event fired when a VR controller button is released over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRControllerButtonUp(event: XRControllerEvent) {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTipXfo()
      this.onDragEnd()
      this.activeController = undefined
    }
  }
}

export default BaseLinearMovementHandle
export { BaseLinearMovementHandle }
