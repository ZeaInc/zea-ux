import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Ray,
  Vec3,
  GeomItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  ParameterOwner,
  CADBody,
  CompoundGeom,
  Xfo,
} from '@zeainc/zea-engine'
import { MeasureDistance } from './MeasureDistance'
import { MeasureTool } from './MeasureTool'
import { MeasurementChange } from './MeasurementChange'
import { AppData } from '../../types/types'

import { getPointerRay } from '../utility'

/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureCenterDistancesTool extends MeasureTool {
  /**
   * @param appData - The appData value
   */
  constructor(appData: AppData) {
    super(appData)

    this.geomConstraints = {
      CurveType: ['Circle'],
      SurfaceType: ['Cylinder', 'Cone', 'Plane'],
    }
    this.numStages = 2
  }

  /**
   * @private
   */
  snapToParametricCenter(geomXfo: Xfo, geomParams: ParameterOwner, pos: Vec3): Vec3 {
    if (geomParams.hasParameter('CurveType')) {
      const curveType = geomParams.getParameter('CurveType').value

      switch (curveType) {
        case 'Circle': {
          const crvToPnt = pos.subtract(geomXfo.tr)
          const zaxis = geomXfo.ori.getZaxis()
          return geomXfo.tr.add(zaxis.scale(crvToPnt.dot(zaxis)))
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
        case 'Cylinder':
        case 'Cone': {
          const srfToPnt = pos.subtract(geomXfo.tr)
          const zaxis = geomXfo.ori.getZaxis()
          return geomXfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))
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
        const startPos = this.snapToParametricCenter(xfoA, this.highlightedItemA_params, hitPos)
        const color = this.colorParam.value

        const measurement = new MeasureDistance('Measure Distance', color, this.appData.sceneUnits)
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

        const xfoA = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
        const xfoB = this.getGeomXfo(this.highlightedItemB, this.highlightedItemB_componentId)

        // Find the closes point on highlightedItemB to the point we clicked on with the mouse.
        let endPos = this.snapToParametricCenter(xfoB, this.highlightedItemB_params, hitPos)
        // Find the closes point on highlightedItemA to the endPoint.
        const startPos = this.snapToParametricCenter(xfoA, this.highlightedItemA_params, endPos)
        // Now find the closest point on highlightedItemB to startPos
        endPos = this.snapToParametricCenter(xfoB, this.highlightedItemB_params, startPos)

        const measurement = <MeasureDistance>this.measurement
        measurement.setStartMarkerPos(startPos)
        measurement.setEndMarkerPos(endPos)

        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
          this.highlightedItemA = null
        }
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
          this.highlightedItemB = null
        }
        this.stage = 0
        this.measurement = null
        event.stopPropagation()
      }
    }
  }
}

export { MeasureCenterDistancesTool }
