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
   * @param {GeomItem} geomItem
   * @param {string} key
   * @private
   */
  highlightEdge(geomItem, key) {}

  /**
   * @param {GeomItem} geomItem
   * @param {Vec3} pos
   * @return {Vec3}
   * @private
   */
  snapToParametricEdge(geomItem, pos) {
    const curveType = geomItem.getParameter('curveType').getValue()
    const curveXfo = geomItem.getParameter('GlobalXfo').getValue()

    switch (curveType) {
      case 'Line': {
        const pointToCurve = pos.subtract(curveXfo.tr)
        const xaxis = curveXfo.ori.getXaxis()
        return curveXfo.tr.add(xaxis.scale(pointToCurve.dot(xaxis)))
      }
      case 'Circle': {
        const pointToCurve = pos.subtract(curveXfo.tr)
        const radius = geomItem.getParameter('Radius').getValue() * curveXfo.sc.x
        const zaxis = curveXfo.ori.getZaxis()
        pointToCurve.subtractInPlace(zaxis.scale(pointToCurve.dot(zaxis)))
        const length = pointToCurve.length()
        return curveXfo.tr.add(pointToCurve.scale(radius / length))
      }
      default: {
        console.log('Unhandled Edge Type: ', curveType)
      }
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
      let hitPos
      if (event.intersectionData) {
        hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
      } else {
        const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
        const distance = ray.intersectRayPlane(plane)
        hitPos = ray.start.add(ray.dir.scale(distance))
      }

      const startPos = this.snapToParametricEdge(this.highlightedItemA, hitPos)
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
          if (geomItem.hasParameter('curveType')) {
            if (this.highlightedItemB) {
              this.highlightedItemB.removeHighlight('measureB', true)
              this.highlightedItemB = null
            }

            this.highlightedItemB = geomItem
            this.highlightedItemB.addHighlight('measureB', new Color(1, 1, 1, 0.2), true)

          }
        }

        if (this.highlightedItemB) {
          const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
          const endPos = this.snapToParametricEdge(this.highlightedItemB, hitPos)
          this.measurementChange.update({ endPos })
        }
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
        if (geomItem.hasParameter('curveType')) {
          if (!geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight('measureA', true)
            }
            this.highlightedItemA = geomItem
            this.highlightedItemA.addHighlight('measureA', new Color(1, 1, 1, 0.2), true)
          }
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

      if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measureA', true)
      if (this.highlightedItemB) this.highlightedItemB.removeHighlight('measureB', true)

      event.stopPropagation()
    }
  }
}

export { MeasurementTool }
