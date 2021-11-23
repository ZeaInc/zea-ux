import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Ray,
  Vec3,
  Color,
  ColorParameter,
  BaseTool,
  TreeItem,
  GeomItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
import { MeasureDistance } from './MeasureDistance'
import { AppData } from '../../types/temp'

import { getPointerRay } from '../utility'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureRadiusTool extends BaseTool {
  colorParam = new ColorParameter('Color', new Color('#F9CE03'))
  appData: AppData
  highlightedItemA: TreeItem = null
  prevCursor: string
  dragging: boolean
  /**
   * Creates an instance of MeasureRadiusTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData: AppData) {
    super()

    this.addParameter(this.colorParam)
    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
  }

  /**
   * The activateTool method.
   */
  activateTool(): void {
    super.activateTool()
    if (this.appData && this.appData.renderer) {
      this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
      this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
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
  onPointerDown(event: ZeaPointerEvent): void {
    // skip if the alt key is held. Allows the camera tool to work
    if (event instanceof ZeaMouseEvent && (event.altKey || event.button !== 0 || !event.intersectionData)) {
      return
    }
    if (event instanceof ZeaTouchEvent && (event.altKey || !event.intersectionData || event.touches.length > 1)) {
      return
    }

    if (this.highlightedItemA) {
      const ray = getPointerRay(event)
      let hitPos
      if (event.intersectionData) {
        hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
      } else {
        const plane = new Ray(new Vec3(), new Vec3(0, 0, 1))
        const distance = ray.intersectRayPlane(plane)
        hitPos = ray.start.add(ray.dir.scale(distance))
      }
      const geomItem = this.highlightedItemA
      const xfo = geomItem.globalXfoParam.value
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
            break
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
            break
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
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event: ZeaPointerEvent): void {
    // skip if the alt key is held. Allows the camera tool to work
    if (
      ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.altKey) ||
      (event instanceof ZeaMouseEvent && event.button !== 0)
    )
      return

    if (!this.dragging) {
      if (event.intersectionData) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (
          (geomItem.hasParameter('CurveType') && geomItem.getParameter('CurveType').getValue() == 'Circle') ||
          (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Cylinder')
        ) {
          if (geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight('measure', true)
            }
            this.highlightedItemA = geomItem
            const color = this.colorParam.getValue()
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
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event): void {}
}

export { MeasureRadiusTool }
