import { TreeItem, Ray, ColorParameter, Color } from '@zeainc/zea-engine'

/**
 * A Handle is an UI widget that lives in the scene, it translates a series of pointer events into a higher level interaction.
 *
 * **Parameters**
 * * **Color(`ColorParameter`):** Specifies the color of the handle.
 * * **HighlightColor(`ColorParameter`):** Specifies the highlight color of the handle.
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
    this.colorParam = this.addParameter(new ColorParameter('Color', new Color()))
    this.highlightColorParam = this.addParameter(new ColorParameter('HighlightColor', new Color(1, 1, 1)))
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    console.warn('@Handle#highlight - Implement me!')
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    console.warn('@Handle#unhighlight - Implement me!')
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
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onPointerEnter(event) {
    this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onPointerLeave(event) {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onPointerDown(event) {
    event.setCapture(this)
    event.stopPropagation()
    this.captured = true

    if (event.changedTouches) {
      this.highlight()
    }

    if (event.viewport) this.handlePointerDown(event)
    else if (event.vrviewport) this.onVRControllerButtonDown(event)
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onPointerMove(event) {
    if (this.captured) {
      event.stopPropagation()
      if (event.viewport) this.handlePointerMove(event)
      else if (event.vrviewport) this.onVRPoseChanged(event)
    }

    event.preventDefault()
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onPointerUp(event) {
    if (this.captured) {
      event.releaseCapture()
      event.stopPropagation()
      this.captured = false
      if (event.changedTouches) {
        this.unhighlight()
      }
      if (event.viewport) this.handlePointerUp(event)
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
  handlePointerDown(event) {
    this.gizmoRay = this.getManipulationPlane()
    const ray = event.pointerRay
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
   * @param {MouseEvent} event - The event param.
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
    console.warn('@Handle#onDragStart - Implement me!', event)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    console.warn('@Handle#onDrag - Implement me!', event)
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    console.warn('@Handle#onDragEnd - Implement me!', event)
  }
}

export default Handle
export { Handle }
