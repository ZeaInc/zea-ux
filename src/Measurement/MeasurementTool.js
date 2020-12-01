import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3, Color, ColorParameter, BaseTool } from '@zeainc/zea-engine'
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
    super()

    this.colorParam = this.addParameter(new ColorParameter('Color', new Color('#FCFC00')))
    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.measurementChange = undefined
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()
    this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
    if (this.appData) this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool()
    if (this.appData) this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0)) return

    const ray = event.pointerRay
    let startPos
    if (event.intersectionData) {
      startPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
    } else {
      const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
      const distance = ray.intersectRayPlane(plane)
      startPos = ray.start.add(ray.dir.scale(distance))
    }

    const color = this.colorParam.getValue()

    this.measurementChange = new MeasurementChange(this.appData.scene.getRoot(), startPos, color)
    UndoRedoManager.getInstance().addChange(this.measurementChange)
    this.dragging = true

    event.stopPropagation()
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

      event.stopPropagation()
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {
    if (this.dragging) {
      this.dragging = false
      this.measurementChange.end()
      this.measurementChange = undefined
      event.stopPropagation()
    }
  }
}

UndoRedoManager.registerChange('MeasurementTool', MeasurementTool)

export { MeasurementTool }
