import { Vec3, ZeaPointerEvent, ZeaMouseEvent, ZeaTouchEvent, XRControllerEvent, XRPoseEvent } from '@zeainc/zea-engine'

import { getPointerRay } from '../utility'
import Handle from './Handle'

/**
 * Class representing a base linear movement scene widget.
 *
 * @extends Handle
 */
class BaseLinearMovementHandle extends Handle {
  grabDist: number
  /**
   * Create base linear movement scene widget.
   * @param name - The name value.
   */
  constructor(name: string) {
    super(name)
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param event - The event param.
   */
  handlePointerDown(event: ZeaPointerEvent): void {
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
   * @param event - The event param
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
   * @param event - The event param.
   */
  handlePointerUp(event: ZeaPointerEvent): void {
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
   * @param event - The event param.
   */
  onXRControllerButtonDown(event: XRControllerEvent): void {
    this.gizmoRay = this.getManipulationPlane()

    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo()
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir)
    this.grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist))

    //this.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * The onXRPoseChanged method.
   *
   * @param event - The event param.
   */
  onXRPoseChanged(event: XRPoseEvent): void {
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
   * @param event - The event param.
   * @return - The return value.
   */
  onVRControllerButtonUp(event: XRControllerEvent): void {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTipXfo()
      this.onDragEnd()
      this.activeController = undefined
    }
  }
}

export default BaseLinearMovementHandle
export { BaseLinearMovementHandle }
