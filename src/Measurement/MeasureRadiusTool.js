import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3, Color, ColorParameter, BaseTool } from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
import { MeasureDistance } from './MeasureDistance'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureRadiusTool extends BaseTool {
  /**
   * Creates an instance of MeasureRadiusTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super()

    this.colorParam = this.addParameter(new ColorParameter('Color', new Color('#F9CE03')))
    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.highlightedItemA = null
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
   * @param {ZeaMouseEvent|ZeaTouchEvent} event - The event value
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0) || !event.intersectionData) return

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
      const geomItem = this.highlightedItemA
      const xfo = geomItem.getParameter('GlobalXfo').getValue()
      let axisPos
      let edgePos
      if (geomItem.hasParameter('CurveType')) {
        const curveType = geomItem.getParameter('CurveType').getValue()
        switch (curveType) {
          case 'Circle': {
            const crvToPnt = hitPos.subtract(xfo.tr)
            const radius = geomItem.getParameter('Radius').getValue() * xfo.sc.x
            const zaxis = xfo.ori.getZaxis()
            crvToPnt.subtractInPlace(zaxis.scale(crvToPnt.dot(zaxis)))
            const length = crvToPnt.length()
            axisPos = xfo.tr
            edgePos = axisPos.add(crvToPnt.scale(radius / length))
          }
          default: {
            console.log('Unhandled Edge Type: ', curveType)
          }
        }
      } else if (geomItem.hasParameter('SurfaceType')) {
        const surfaceType = geomItem.getParameter('SurfaceType').getValue()
        switch (surfaceType) {
          case 'Cylinder': {
            const srfToPnt = hitPos.subtract(xfo.tr)
            const zaxis = xfo.ori.getZaxis()
            axisPos = xfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))

            const radius = geomItem.getParameter('Radius').getValue() * xfo.sc.x
            const axisToPnt = hitPos.subtract(axisPos)
            const length = axisToPnt.length()
            edgePos = axisPos.add(axisToPnt.scale(radius / length))
          }
          default: {
            console.log('Unhandled Surface Type: ', surfaceType)
          }
        }
      }
      const color = this.colorParam.getValue()

      const measurement = new MeasureDistance('MeasureRadius', color)
      measurement.setStartMarkerPos(axisPos)
      measurement.setEndMarkerPos(edgePos)
      measurement.setGeomBuffersVisibility(false)
      this.appData.scene.getRoot().addChild(measurement)

      const measurementChange = new MeasurementChange(measurement)
      UndoRedoManager.getInstance().addChange(measurementChange)

      if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measure', true)
      event.stopPropagation()
    }
  }

  /**
   *
   *
   * @param {ZeaMouseEvent|ZeaTouchEvent} event - The event value
   */
  onPointerMove(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0)) return

    if (!this.dragging) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (
          (geomItem.hasParameter('CurveType') && geomItem.getParameter('CurveType').getValue() == 'Circle') ||
          (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Cylinder')
        ) {
          if (geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight('measure', true)
            }
            this.highlightedItemA = geomItem
            const color = this.colorParam.getValue().clone()
            color.a = 0.2
            this.highlightedItemA.addHighlight('measure', color, true)
          }
        }
      } else {
        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight('measure', true)
          this.highlightedItemA = null
        }
      }
    }
  }

  /**
   *
   *
   * @param {ZeaMouseEvent|ZeaTouchEvent} event - The event value
   */
  onPointerUp(event) {}
}

export { MeasureRadiusTool }
