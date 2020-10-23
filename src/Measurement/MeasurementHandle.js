import { GeomItem } from '@zeainc/zea-engine'
import { ScreenSpaceMovementHandle } from '../Handles/ScreenSpaceMovementHandle'

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
  handlePointerMove(event) {
    const ray = event.pointerRay
    event.intersectionData = event.viewport.getGeomDataAtPos(event.pointerPos, event.pointerRay)
    if (event.intersectionData) {
      event.holdPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
    } else {
      const dist = ray.intersectRayPlane(this.gizmoRay)
      event.holdPos = ray.pointAtDist(dist)
    }

    this.onDrag(event)
    return true
  }

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    super.onDragStart(event)

    this.getOwner().traverse((item) => {
      if (item instanceof GeomItem) {
        item.getParameter('Material').getValue().visibleInGeomDataBuffer = false
      }
    })
    event.viewport.renderGeomDataFbo()
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    // const dragVec = event.holdPos.subtract(this.grabPos)

    const newXfo = this.baseXfo.clone()
    // newXfo.tr.addInPlace(dragVec)
    newXfo.tr = event.holdPos

    this.change.update({
      value: newXfo,
    })
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    super.onDragEnd(event)

    this.getOwner().traverse((item) => {
      if (item instanceof GeomItem) item.getParameter('Material').getValue().visibleInGeomDataBuffer = true
    })
    event.viewport.renderGeomDataFbo()
  }
}

export { MeasurementHandle }
