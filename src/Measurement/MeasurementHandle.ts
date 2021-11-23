import {
  GeomItem,
  Registry,
  TreeItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'

import { ScreenSpaceMovementHandle } from '../Handles/ScreenSpaceMovementHandle'
import { getPointerRay } from '../utility'

/**
 *
 *
 * @extends {ScreenSpaceMovementHandle}
 */
class MeasurementHandle extends ScreenSpaceMovementHandle {
  /**
   * Handles mouse move interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent} event - The event param
   * @return {boolean} - The return value
   */
  handlePointerMove(event: ZeaPointerEvent) {
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn('not handling VR')
      return
    }
    const ray = getPointerRay(event)
    event.intersectionData = event.viewport.getGeomDataAtPos(event.pointerPos, ray)
    if (event.intersectionData) {
      this.holdPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
    } else {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      this.holdPos = ray.pointAtDist(dist)
    }

    this.onDrag(event)
    return true
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event: ZeaPointerEvent) {
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn('not handling VR')
      return
    }
    super.onDragStart(event)
    const owner = <TreeItem>this.getOwner()
    owner.setSelectable(false)
    owner.traverse((item) => {
      if (item instanceof GeomItem) {
        item.setSelectable(false)
      }
    })
    event.viewport.renderGeomDataFbo()
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event: ZeaPointerEvent) {
    // const dragVec = this.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    // newXfo.tr.addInPlace(dragVec)
    newXfo.tr = this.holdPos

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
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn('not handling VR')
      return
    }
    super.onDragEnd(event)
    const owner = <TreeItem>this.getOwner()
    owner.traverse((item) => {
      if (item instanceof GeomItem) {
        item.setSelectable(true)
      }
    })

    event.viewport.renderGeomDataFbo()
  }
}

Registry.register('MeasurementHandle', MeasurementHandle)
export { MeasurementHandle }
