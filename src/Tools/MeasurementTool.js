import BaseTool from './BaseTool'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Measurement } from './Measurement'
import { Ray, Vec3 } from '@zeainc/zea-engine'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasurementTool extends BaseTool {
  /**
   * Creates an instance of MeasurementTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super(appData)
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    console.log('Down')
    const ray = event.pointerRay
    let startPos
    if (event.intersectionData) {
      startPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
    } else {
      const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
      const distance = ray.intersectRayPlane(plane)
      startPos = ray.start.add(ray.dir.scale(distance))
    }

    this.measurement = new Measurement()
    this.measurement.setStartMarkerPos(startPos)
    this.measurement.setEndMarkerPos(startPos)
    this.measurement.setGeomBuffersVisibility(false)
    this.appData.scene.getRoot().addChild(this.measurement)
    this.dragging = true
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event) {
    if (this.dragging) {
      const ray = event.pointerRay
      let endPos
      if (event.intersectionData) {
        endPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
      } else {
        const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
        const distance = ray.intersectRayPlane(plane)
        endPos = ray.start.add(ray.dir.scale(distance))
        console.log('endPos', endPos.toString())
      }

      this.measurement.setEndMarkerPos(endPos)
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {
    this.measurement.setGeomBuffersVisibility(true)
    this.dragging = false
    this.measurement = undefined
  }
}

UndoRedoManager.registerChange('MeasurementTool', MeasurementTool)

export { MeasurementTool }
