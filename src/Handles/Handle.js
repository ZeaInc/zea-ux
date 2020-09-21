import { TreeItem, Ray } from '@zeainc/zea-engine'

/**
 * A Handle is a UI widget that lives in the scene.
 * Much like a slider, it translates a series of mouse events into a higher level interaction.
 *
 * @extends TreeItem
 */
class Handle extends TreeItem {
  /**
   * Creates an instance of Handle.
   *
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)

    this.captured = false
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    // console.warn('Implement me')
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    // console.warn('Implement me')
  }

  /**
   * Returns the manipulation plane of the handle, denoting a start and a direction.
   *
   * @return {Ray} The return value.
   */
  getManipulationPlane() {
    const xfo = this.getParameter('GlobalXfo').getValue()
    return new Ray(xfo.tr, xfo.ori.getZaxis())
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device is initially moved within the space of the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseEnter(event) {
    this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseLeave(event) {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseDown(event) {
    event.setCapture(this)
    event.stopPropagation()
    this.captured = true
    if (event.viewport) this.handleMouseDown(event)
    else if (event.vrviewport) this.onVRControllerButtonDown(event)
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseMove(event) {
    if (this.captured) {
      event.stopPropagation()
      if (event.viewport) this.handleMouseMove(event)
      else if (event.vrviewport) this.onVRPoseChanged(event)
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseUp(event) {
    if (this.captured) {
      event.releaseCapture()
      event.stopPropagation()
      this.captured = false
      if (event.viewport) this.handleMouseUp(event)
      else if (event.vrviewport) this.onVRControllerButtonUp(event)
    }
  }

  /**
   * Event fired when the user rotates the pointing device wheel over the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onWheel(event) {}

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationPlane()
    const ray = event.mouseRay || event.touchRay
    const dist = ray.intersectRayPlane(this.gizmoRay)
    event.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
    return true
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent} event - The event param
   * @return { boolean } - The return value
   */
  handleMouseMove(event) {
    const ray = event.mouseRay || event.touchRay
    const dist = ray.intersectRayPlane(this.gizmoRay)
    event.holdPos = ray.pointAtDist(dist)
    this.onDrag(event)
    return true
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handleMouseUp(event) {
    const ray = event.mouseRay || event.touchRay
    if (ray) {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      event.releasePos = ray.pointAtDist(dist)
    }

    this.onDragEnd(event)
    return true
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
    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo().clone()

    const gizmoRay = this.getManipulationPlane()
    const offset = xfo.tr.subtract(gizmoRay.start)
    const grabPos = xfo.tr.subtract(gizmoRay.dir.scale(offset.dot(gizmoRay.dir)))
    event.grabPos = grabPos
    this.onDragStart(event)
    return true
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRPoseChanged(event) {
    if (this.activeController) {
      const xfo = this.activeController.getTipXfo()
      const gizmoRay = this.getManipulationPlane()
      const offset = xfo.tr.subtract(gizmoRay.start)
      const holdPos = xfo.tr.subtract(gizmoRay.dir.scale(offset.dot(gizmoRay.dir)))
      event.holdPos = holdPos
      this.onDrag(event)
      return true
    }
  }

  /**
   * Event fired when a VR controller button is released over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTipXfo()
      this.onDragEnd(event, xfo.tr)
      this.activeController = undefined
      return true
    }
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    console.log('onDragStart', event)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    console.log('onDrag', event)
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    console.log('onDragEnd', event)
  }
}

export default Handle
export { Handle }
