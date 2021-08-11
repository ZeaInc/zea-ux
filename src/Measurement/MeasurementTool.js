import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3, Color, ColorParameter, BaseTool } from '@zeainc/zea-engine'
import { MeasureDistance } from './MeasureDistance'
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
    this.stage = 0
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

    if (this.stage != 0) {
      const parentItem = this.measurement.getOwner()
      parentItem.removeChild(parentItem.getChildIndex(this.measurement))
      this.measurement = null

      if (this.highlightedItemB) {
        this.highlightedItemB.removeHighlight('measure', true)
        this.highlightedItemB = null
      }
      if (this.highlightedItemA) {
        this.highlightedItemA.removeHighlight('measure', true)
        this.highlightedItemA = null
      }
      this.stage = 0
    }
  }

  /**
   * @param {GeomItem} geomItem
   * @param {Vec3} pos
   * @return {Vec3}
   * @private
   */
  snapToParametricEdge(geomItem, pos) {
    const xfo = geomItem.getParameter('GlobalXfo').getValue()
    if (geomItem.hasParameter('CurveType')) {
      const curveType = geomItem.getParameter('CurveType').getValue()

      switch (curveType) {
        case 'Line': {
          const crvToPnt = pos.subtract(xfo.tr)
          const xaxis = xfo.ori.getXaxis()
          return xfo.tr.add(xaxis.scale(crvToPnt.dot(xaxis)))
        }
        case 'Circle': {
          const crvToPnt = pos.subtract(xfo.tr)
          const radius = geomItem.getParameter('Radius').getValue() * xfo.sc.x
          const zaxis = xfo.ori.getZaxis()
          crvToPnt.subtractInPlace(zaxis.scale(crvToPnt.dot(zaxis)))
          const length = crvToPnt.length()
          return xfo.tr.add(crvToPnt.scale(radius / length))
        }
        default: {
          console.log('Unhandled Edge Type: ', curveType)
        }
      }
    } else if (geomItem.hasParameter('SurfaceType')) {
      const surfaceType = geomItem.getParameter('SurfaceType').getValue()

      switch (surfaceType) {
        case 'Plane': {
          const srfToPnt = pos.subtract(xfo.tr)
          const zaxis = xfo.ori.getZaxis()
          return pos.subtract(zaxis.scale(srfToPnt.dot(zaxis)))
        }
        case 'Cylinder': {
          const srfToPnt = pos.subtract(xfo.tr)
          const zaxis = xfo.ori.getZaxis()
          const pointOnAxis = xfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))

          const radius = geomItem.getParameter('Radius').getValue() * xfo.sc.x
          const axisToPnt = pos.subtract(pointOnAxis)
          const length = axisToPnt.length()
          return pointOnAxis.add(axisToPnt.scale(radius / length))
        }
        default: {
          console.log('Unhandled Surface Type: ', surfaceType)
        }
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
    if (event.altKey) return

    if (this.stage == 0) {
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

        this.measurement = new MeasureDistance('Measure Distance', color)
        this.measurement.setStartMarkerPos(startPos)
        this.measurement.setEndMarkerPos(startPos)
        this.appData.scene.getRoot().addChild(this.measurement)

        this.measurementChange = new MeasurementChange(this.measurement)
        UndoRedoManager.getInstance().addChange(this.measurementChange)

        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      if (this.highlightedItemB) {
        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const startPos = this.snapToParametricEdge(this.highlightedItemA, hitPos)
        const endPos = this.snapToParametricEdge(this.highlightedItemB, hitPos)
        this.measurement.setStartMarkerPos(startPos)
        this.measurement.setEndMarkerPos(endPos)

        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight('measure', true)
          this.highlightedItemA = null
        }
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight('measure', true)
          this.highlightedItemB = null
        }
        this.stage = 0
        this.measurement = null
        event.stopPropagation()
      }
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || !event.intersectionData) return

    if (this.stage == 0) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem.hasParameter('CurveType') || geomItem.hasParameter('SurfaceType')) {
          if (!geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight('measure', true)
            }
            this.highlightedItemA = geomItem
            this.highlightedItemA.addHighlight('measure', new Color(1, 1, 1, 0.2), true)
          }
        }
      } else {
        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight('measure', true)
          this.highlightedItemA = null
        }
      }
      event.stopPropagation()
    } else if (this.stage == 1) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem != this.highlightedItemA && geomItem != this.highlightedItemB) {
          if (geomItem.hasParameter('CurveType') || geomItem.hasParameter('SurfaceType')) {
            if (this.highlightedItemB) {
              this.highlightedItemB.removeHighlight('measure', true)
              this.highlightedItemB = null
            }

            this.highlightedItemB = geomItem
            this.highlightedItemB.addHighlight('measure', new Color(1, 1, 1, 0.2), true)
          }
        }
      } else {
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight('measure', true)
          this.highlightedItemB = null
        }
      }

      event.stopPropagation()
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event) {}
}

export { MeasurementTool }
