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
    this.measurementChange = null
    this.highlightedItemA = null
    this.highlightedItemB = null
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()
    if (this.appData && this.appData.renderer) {
      this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
      this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool()
    if (this.appData && this.appData.renderer) {
      this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0)) return

    if (this.highlightedItemA) {
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
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event) {
    if (this.dragging) {
      const ray = event.pointerRay
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem != this.highlightedItemB) {
          if (this.highlightedItemB) this.highlightedItemB.removeHighlight('measureB', true)

          geomItem.addHighlight('measureB', new Color(1, 1, 1, 0.2), true)

          this.highlightedItemB = geomItem
        }
        const endPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        this.measurementChange.update({ endPos })
      } else {
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight('measureB', true)
          this.highlightedItemB = null
        }
      }

      event.stopPropagation()
    } else {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (!geomItem != this.highlightedItemA) {
          if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measureA', true)
          geomItem.addHighlight('measureA', new Color(1, 1, 1, 0.2), true)
          this.highlightedItemA = geomItem
        }
      } else {
        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight('measureA', true)
          this.highlightedItemA = null
        }
      }
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
      this.measurementChange = null
      event.stopPropagation()
    }
  }
}

export { MeasurementTool }
