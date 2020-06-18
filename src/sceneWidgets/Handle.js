import { TreeItem, Ray } from '@zeainc/zea-engine'

// A Handle is a UI widget that lives in the scene.
// Much like a slider, it translates a series of
// mouse events into a higher level interaction.

/** Class representing a scene widget.
 * @extends TreeItem
 */
export default class Handle extends TreeItem {
  /**
   * Create a scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name)

    this.captured = false
  }

  /**
   * The highlight method.
   */
  highlight() {}

  /**
   * The unhighlight method.
   */
  unhighlight() {}

  /**
   * The getManipulationPlane method.
   * @return {any} The return value.
   */
  getManipulationPlane() {
    const xfo = this.getGlobalXfo()
    return new Ray(xfo.tr, xfo.ori.getZaxis())
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseEnter method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseEnter(event) {
    this.highlight()
  }

  /**
   * The onMouseLeave method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseLeave(event) {
    this.unhighlight()
  }

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseDown(event) {
    event.setCapture(this)
    event.stopPropagation()
    this.captured = true
    if (event.viewport) this.handleMouseDown(event)
    else if (event.vrviewport) this.onVRControllerButtonDown(event)
  }

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onMouseMove(event) {
    if (this.captured) {
      event.stopPropagation()
      if (event.viewport) this.handleMouseMove(event)
      else if (event.vrviewport) this.onVRPoseChanged(event)
    }
  }

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
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
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationPlane()
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.grabPos = event.mouseRay.pointAtDist(dist)
    this.onDragStart(event)
    return true
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.holdPos = event.mouseRay.pointAtDist(dist)
    this.onDrag(event)
    return true
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay)
    event.releasePos = event.mouseRay.pointAtDist(dist)
    this.onDragEnd(event)
    return true
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo().clone()

    const gizmoRay = this.getManipulationPlane()
    const offset = xfo.tr.subtract(gizmoRay.start)
    const grabPos = xfo.tr.subtract(
      gizmoRay.dir.scale(offset.dot(gizmoRay.dir))
    )
    event.grabPos = grabPos
    this.onDragStart(event)
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    if (this.activeController) {
      const xfo = this.activeController.getTipXfo()
      const gizmoRay = this.getManipulationPlane()
      const offset = xfo.tr.subtract(gizmoRay.start)
      const holdPos = xfo.tr.subtract(
        gizmoRay.dir.scale(offset.dot(gizmoRay.dir))
      )
      event.holdPos = holdPos
      this.onDrag(event)
      return true
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
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
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    console.log('onDragStart', event)
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    console.log('onDrag', event)
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    console.log('onDragEnd', event)
  }
}
