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
import { MeasureDistance } from './MeasureDistance'
import { MeasurementChange } from './MeasurementChange'
import { MeasureTool } from './MeasureTool'
import { AppData } from '../../types/types'

import { getPointerRay } from '../utility'

/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureDistanceTool extends MeasureTool {
  /**
   * @param geomItem
   * @param pos
   * @return
   * @private
   */
  snapToParametricEdge(geomItem: GeomItem, pos: Vec3): Vec3 {
    const xfo = geomItem.globalXfoParam.value
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
   * @param event - The event value
   */
  onPointerDown(event: ZeaPointerEvent): void {
    // skip if the alt key is held. Allows the camera tool to work
    if (
      ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.altKey) ||
      (event instanceof ZeaMouseEvent && event.button !== 0) ||
      !event.intersectionData
    )
      return

    if (this.stage == 0) {
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

        const startPos = this.snapToParametricEdge(<GeomItem>this.highlightedItemA, hitPos)
        const color = this.colorParam.getValue()

        const measurement = new MeasureDistance('Measure Distance', color)
        measurement.setStartMarkerPos(startPos)
        measurement.setEndMarkerPos(startPos)
        this.appData.scene.getRoot().addChild(measurement)

        this.measurementChange = new MeasurementChange(measurement)
        UndoRedoManager.getInstance().addChange(this.measurementChange)

        this.measurement = measurement
        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      if (this.highlightedItemB) {
        const ray = getPointerRay(event)
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const startPos = this.snapToParametricEdge(<GeomItem>this.highlightedItemA, hitPos)
        const endPos = this.snapToParametricEdge(<GeomItem>this.highlightedItemB, hitPos)

        const measurement = <MeasureDistance>this.measurement
        measurement.setStartMarkerPos(startPos)
        measurement.setEndMarkerPos(endPos)

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
   * @param event - The event value
   */
  onPointerMove(event: ZeaPointerEvent): void {
    // skip if the alt key is held. Allows the camera tool to work
    if (
      ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.altKey) ||
      (event instanceof ZeaMouseEvent && event.button !== 0)
    ) {
      return
    }

    const color = this.colorParam.getValue()
    color.a = 0.2
    if (this.stage == 0) {
      if (event.intersectionData) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (geomItem.hasParameter('CurveType') || geomItem.hasParameter('SurfaceType')) {
          if (geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight('measure', true)
            }
            this.highlightedItemA = geomItem
            this.highlightedItemA.addHighlight('measure', color, true)
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
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (geomItem != this.highlightedItemA && geomItem != this.highlightedItemB) {
          if (geomItem.hasParameter('CurveType') || geomItem.hasParameter('SurfaceType')) {
            if (this.highlightedItemB) {
              this.highlightedItemB.removeHighlight('measure', true)
              this.highlightedItemB = null
            }

            this.highlightedItemB = geomItem
            this.highlightedItemB.addHighlight('measure', color, true)
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
   * @param event - The event value
   */
  onPointerUp(event: ZeaPointerEvent): void {}
}

export { MeasureDistanceTool }
