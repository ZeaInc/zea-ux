import BaseTool from '../Tools/BaseTool'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3 } from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
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
    this.measurementChange = undefined
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    const ray = event.pointerRay
    let startPos
    if (event.intersectionData) {
      startPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
    } else {
      const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
      const distance = ray.intersectRayPlane(plane)
      startPos = ray.start.add(ray.dir.scale(distance))
    }

    this.measurementChange = new MeasurementChange(this.appData.scene.getRoot(), startPos)
    UndoRedoManager.getInstance().addChange(this.measurementChange)
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
      }

      this.measurementChange.update(endPos)
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {
    this.dragging = false
    this.measurementChange.end()
    this.measurementChange = undefined
  }
}

UndoRedoManager.registerChange('MeasurementTool', MeasurementTool)

export { MeasurementTool }
