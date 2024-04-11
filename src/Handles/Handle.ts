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
  XRPoseEvent,
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
  activeController: any
  captured = false
  colorParam = new ColorParameter('Color', new Color())
  highlightColorParam = new ColorParameter('HighlightColor', new Color(1, 1, 1))

  grabPos: Vec3
  holdPos: Vec3
  holdDist: number
  value: number | Vec3 | number[]
  delta: number | Vec3 | number[]
  releasePos: Vec3
  /**
   * Creates an instance of Handle.
   *
   * @param name - The name value.
   */
  constructor(name?: string) {
    super(name)

    this.addParameter(this.colorParam)
    this.addParameter(this.highlightColorParam)
  }

  /**
   * highlight the handle to indicate it is under the mouse.
   */
  highlight(): void {
    this.emit('highlight')
  }

  /**
   * Removes the highlight from the handle once the mouse moves away.
   */
  unhighlight(): void {
    this.emit('unhighlight')
  }

  /**
   * Returns the manipulation plane of the handle, denoting a start and a direction.
   *
   * @return {Ray} The return value.
   */
  getManipulationPlane(): Ray {
    const xfo = this.globalXfoParam.value
    return new Ray(xfo.tr, xfo.ori.getZaxis())
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device is initially moved within the space of the handle.
   *
   * @param event - The event param.
   */
  onPointerEnter(event: ZeaPointerEvent): void {
    this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param event - The event param.
   */
  onPointerLeave(event: ZeaPointerEvent): void {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    event.setCapture(this)
    event.stopPropagation()
    this.captured = true

    if (event instanceof ZeaTouchEvent) {
      this.highlight()
    }

    if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
      this.handlePointerDown(event)
    } else if (event instanceof XRControllerEvent) {
      this.onXRControllerButtonDown(event)
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is over the handle.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (this.captured) {
      event.stopPropagation()
      if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
        this.handlePointerMove(event)
      } else if (event instanceof XRPoseEvent) {
        this.onXRPoseChanged(event)
      }
    }

    //@ts-ignore
    event.preventDefault()
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the handle.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    event.stopPropagation()
    if (this.captured) {
      event.releaseCapture()
      this.captured = false
      if (event instanceof ZeaTouchEvent) {
        this.unhighlight()
      }
      if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
        this.handlePointerUp(event)
      } else if (event instanceof XRControllerEvent) {
        this.onVRControllerButtonUp(event)
      }
    }
  }

  onPointerClick(event: ZeaPointerEvent): void {
    // Prevent the click on the handle from having any secondary effect.
    // e.g. triggering a selection change, or context menu.
    // We do not want to be able to select a handle by clicking on it.
    event.stopPropagation()
  }

  onPointerDoubleClick(event: ZeaPointerEvent): void {
    // Prevent the click on the handle from having any secondary effect.
    // e.g. triggering a selection change, or context menu.
    // We do not want to be able to select a handle by clicking on it.
    event.stopPropagation()
  }

  /**
   * Event fired when the user rotates the pointing device wheel over the handle.
   *
   * @param event - The event param.
   */
  onWheel(event: ZeaWheelEvent): void {}

  /**
   * Handles mouse down interaction with the handle.
   *
   * @param event - The event param.
   */
  handlePointerDown(event: ZeaPointerEvent): void {
    this.gizmoRay = this.getManipulationPlane()
    const ray = getPointerRay(event)

    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.grabPos = ray.pointAtDist(dist)
    this.onDragStart(event)
  }

  /**
   * Handles mouse move interaction with the handle.
   *
   * @param event - The event param
   */
  handlePointerMove(event: ZeaPointerEvent): void {
    const ray = getPointerRay(event)
    const dist = ray.intersectRayPlane(this.gizmoRay)
    this.holdPos = ray.pointAtDist(dist)
    this.onDrag(event)
  }

  /**
   * Handles mouse up interaction with the handle.
   *
   * @param event - The event param.
   */
  handlePointerUp(event: ZeaPointerEvent): void {
    const ray = event.pointerRay
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
   * @param event - The event param.
   */
  onXRControllerButtonDown(event: XRControllerEvent): void {
    this.activeController = event.controller
    const xfo = this.activeController.getTipXfo().clone()

    const gizmoRay = this.getManipulationPlane()
    const offset = xfo.tr.subtract(gizmoRay.start)
    const grabPos = xfo.tr.subtract(gizmoRay.dir.scale(offset.dot(gizmoRay.dir)))
    this.grabPos = grabPos
    this.onDragStart(event)
  }

  /**
   * The onXRPoseChanged method.
   *
   * @param event - The event param.
   */
  onXRPoseChanged(event: XRPoseEvent): void {
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
   * @param event - The event param.
   */
  onVRControllerButtonUp(event: XRControllerEvent): void {
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
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    console.warn('@Handle#onDragStart - Implement me!', event)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    console.warn('@Handle#onDrag - Implement me!', event)
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event?: ZeaPointerEvent): void {
    console.warn('@Handle#onDragEnd - Implement me!', event)
  }

  /**
   * Sets the target parameter for manipulation
   *
   * @param param - The parameter that will be modified during manipulation
   */
  setTargetParam(param: Parameter<unknown>): void {
    console.warn('setTargetParam not implemented')
  }
}

export default Handle
export { Handle }
