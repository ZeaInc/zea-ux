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
  handlePointerDown(event) {
    this.gizmoRay = this.getManipulationPlane()
    const ray = event.pointerRay
    this.grabDist = ray.intersectRayVector(this.gizmoRay)[1]
    const grabPos = this.gizmoRay.pointAtDist(this.grabDist)
    event.grabDist = this.grabDist
    event.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param
   */
  handlePointerMove(event) {
    const ray = event.pointerRay
    const dist = ray.intersectRayVector(this.gizmoRay)[1]
    const holdPos = this.gizmoRay.pointAtDist(dist)
    event.holdDist = dist
    event.holdPos = holdPos
    event.value = dist
    event.delta = dist - this.grabDist
    this.onDrag(event)
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event) {
    const ray = event.pointerRay
    if (ray) {
      const dist = ray.intersectRayVector(this.gizmoRay)[1]
      const releasePos = this.gizmoRay.pointAtDist(dist)
      event.releasePos = releasePos
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
  onVRControllerButtonDown(event) {
    this.gizmoRay = this.getManipulationPlane()

    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo()
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir)
    const grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist))
    event.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo()
    const dist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir)
    const holdPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist))
    event.value = dist
    event.holdPos = holdPos
    event.delta = dist - this.grabDist
    this.onDrag(event)
  }

  /**
   * Event fired when a VR controller button is released over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTipXfo()
      this.onDragEnd()
      this.activeController = undefined
    }
  }
}

export default BaseLinearMovementHandle
export { BaseLinearMovementHandle }
