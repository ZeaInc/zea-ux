import {
  TreeItem,
  Ray,
  ColorParameter,
  Color,
  Parameter,
  Vec3,
  ZeaWheelEvent,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine' // , PointerEvent

import { getPointerRay } from '../utility'

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
  gizmoRay: Ray
  activeController
  captured = false
  colorParam = new ColorParameter('Color', new Color())
  highlightColorParam = new ColorParameter('HighlightColor', new Color(1, 1, 1))

  grabPos: Vec3
  holdPos: Vec3
  holdDist: number
  value: number | Vec3 | number[]
  delta: number | Vec3 | number[]
  releasePos: Vec3
  changedTouches: boolean
  preventDefault: any
  /**
   * Creates an instance of Handle.
   *
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)

    this.addParameter(this.colorParam)
    this.addParameter(this.highlightColorParam)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    this.emit('highlight')
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    this.emit('unhighlight')
  }

  /**
   * Returns the manipulation plane of the handle, denoting a start and a direction.
   *
   * @return {Ray} The return value.
   */
  getManipulationPlane() {
    const xfo = this.globalXfoParam.value
    return new Ray(xfo.tr, xfo.ori.getZaxis())
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device is initially moved within the space of the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onPointerEnter(event: ZeaPointerEvent) {
    this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onPointerLeave(event: ZeaPointerEvent) {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param {PointerEvent} event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent) {
    event.setCapture(this)
    event.stopPropagation()
    this.captured = true

    if (this.changedTouches) {
      this.highlight()
    }

    if (event.pointerType == 'mouse' || event.pointerType == 'touch') {
      this.handlePointerDown(<ZeaMouseEvent>event)
    } else if (event.pointerType == 'xr') {
      this.onVRControllerButtonDown(<XRControllerEvent>event)
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent) {
    if (this.captured) {
      event.stopPropagation()
      if (event.pointerType == 'mouse' || event.pointerType == 'touch') {
        this.handlePointerMove(<ZeaMouseEvent>event)
      } else if (event.pointerType == 'xr') {
        this.onVRPoseChanged(<XRControllerEvent>event)
      }
    }

    // TODO: (check) used to be event.preventDefault()
    //@ts-ignore
    event.preventDefault()
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent) {
    if (this.captured) {
      event.releaseCapture()
      event.stopPropagation()
      this.captured = false
      if (this.changedTouches) {
        this.unhighlight()
      }
      if (event.pointerType == 'mouse' || event.pointerType == 'touch') {
        this.handlePointerUp(<ZeaMouseEvent>event)
      } else if (event.pointerType == 'xr') {
        this.onVRControllerButtonUp(<XRControllerEvent>event)
      }
    }
  }

  /**
   * Event fired when the user rotates the pointing device wheel over the handle.
   *
   * @param {WheelEvent} event - The event param.
   */
  onWheel(event: ZeaWheelEvent) {}

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerDown(event: ZeaMouseEvent) {
    this.gizmoRay = this.getManipulationPlane()
    const ray = getPointerRay(event)
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent} event - The event param
   * @return { boolean } - The return value
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
   * @param {MouseEvent} event - The event param.
   * @return {boolean} - The return value.
   */
  handlePointerUp(event: ZeaMouseEvent) {
    const ray = getPointerRay(event)
    if (ray) {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      this.releasePos = ray.pointAtDist(dist)
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
    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo().clone()

    const gizmoRay = this.getManipulationPlane()
    const offset = xfo.tr.subtract(gizmoRay.start)
    const grabPos = xfo.tr.subtract(gizmoRay.dir.scale(offset.dot(gizmoRay.dir)))
    this.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRPoseChanged(event: XRControllerEvent) {
    if (this.activeController) {
      const xfo = this.activeController.getTipXfo()
      const gizmoRay = this.getManipulationPlane()
      const offset = xfo.tr.subtract(gizmoRay.start)
      const holdPos = xfo.tr.subtract(gizmoRay.dir.scale(offset.dot(gizmoRay.dir)))
      this.holdPos = holdPos
      this.onDrag(event)
    }
  }

  /**
   * Event fired when a VR controller button is released over the handle.
   *
   * @param {object} event - The event param.
   * @return {boolean} - The return value.
   */
  onVRControllerButtonUp(event: XRControllerEvent) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTipXfo()
      // TODO: check this.onDragEnd(event, xfo.tr)
      this.onDragEnd(event)
      this.activeController = undefined
    }
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onDragStart(event: ZeaPointerEvent) {
    console.warn('@Handle#onDragStart - Implement me!', event)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onDrag(event: ZeaPointerEvent) {
    console.warn('@Handle#onDrag - Implement me!', event)
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {PointerEvent} event - The event param.
   */
  onDragEnd(event?: ZeaPointerEvent) {
    console.warn('@Handle#onDragEnd - Implement me!', event)
  }

  // TODO:(check) added this method since we check for type Handle and call this method in XfoHandle.ts
  setTargetParam(param: Parameter<unknown>, track: boolean) {
    console.warn('setTargetParam not implemented')
  }
}

export default Handle
export { Handle }
