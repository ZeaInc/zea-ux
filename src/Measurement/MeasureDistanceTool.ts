import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Ray,
  Vec3,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  ParameterOwner,
  Xfo,
  TreeItem,
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
   * @param appData - The appData value
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super(appData, parentItem)

    this.geomConstraints = {
      CurveType: ['Line', 'Circle'],
      SurfaceType: ['Plane', 'Cylinder'],
    }
    this.numStages = 2
  }

  /**
   * @param geomItem
   * @param pos
   * @return
   * @private
   */
  snapToParametricEdge(geomXfo: Xfo, geomParams: ParameterOwner, pos: Vec3): Vec3 {
    if (geomParams.hasParameter('CurveType')) {
      const curveType = geomParams.getParameter('CurveType').value

      switch (curveType) {
        case 'Line': {
          const crvToPnt = pos.subtract(geomXfo.tr)
          const xaxis = geomXfo.ori.getXaxis()
          return geomXfo.tr.add(xaxis.scale(crvToPnt.dot(xaxis)))
        }
        case 'Circle': {
          const crvToPnt = pos.subtract(geomXfo.tr)
          const radius = geomParams.getParameter('Radius').value * geomXfo.sc.x
          const zaxis = geomXfo.ori.getZaxis()
          crvToPnt.subtractInPlace(zaxis.scale(crvToPnt.dot(zaxis)))
          const length = crvToPnt.length()
          return geomXfo.tr.add(crvToPnt.scale(radius / length))
        }
        default: {
          console.log('Unhandled Edge Type: ', curveType)
        }
      }
    } else if (geomParams.hasParameter('SurfaceType')) {
      const surfaceType = geomParams.getParameter('SurfaceType').value

      switch (surfaceType) {
        case 'Plane': {
          const srfToPnt = pos.subtract(geomXfo.tr)
          const zaxis = geomXfo.ori.getZaxis()
          return pos.subtract(zaxis.scale(srfToPnt.dot(zaxis)))
        }
        case 'Cylinder': {
          const srfToPnt = pos.subtract(geomXfo.tr)
          const zaxis = geomXfo.ori.getZaxis()
          const pointOnAxis = geomXfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))

          const radius = geomParams.getParameter('Radius').value * geomXfo.sc.x
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
    ) {
      return
    }

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

        const xfoA = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
        const startPos = this.snapToParametricEdge(xfoA, this.highlightedItemA_params, hitPos)
        const color = this.colorParam.value

        const measurement = new MeasureDistance('Measure Distance', color)
        measurement.setStartMarkerPos(startPos)
        measurement.setEndMarkerPos(startPos)

        this.measurement = measurement
        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      if (this.highlightedItemB) {
        const ray = getPointerRay(event)
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))

        const xfoA = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
        const xfoB = this.getGeomXfo(this.highlightedItemB, this.highlightedItemB_componentId)

        const startPos = this.snapToParametricEdge(xfoA, this.highlightedItemA_params, hitPos)
        const endPos = this.snapToParametricEdge(xfoB, this.highlightedItemB_params, hitPos)

        const measurement = <MeasureDistance>this.measurement
        measurement.setStartMarkerPos(startPos)
        measurement.setEndMarkerPos(endPos)
        this.parentItem.addChild(measurement)

        const measurementChange = new MeasurementChange(measurement)
        UndoRedoManager.getInstance().addChange(measurementChange)

        this.removeHighlightsAndMakers()

        this.stage = 0
        this.measurement = null
        event.stopPropagation()
        this.emit('actionFinished')
      }
    }
  }
}

export { MeasureDistanceTool }
