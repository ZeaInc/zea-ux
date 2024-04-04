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
  ParameterOwner,
  CADBody,
  CompoundGeom,
  GLViewport,
} from '@zeainc/zea-engine'
import { MeasureTool } from './MeasureTool'
import { MeasurementChange } from './MeasurementChange'
import { MeasureDistance } from './MeasureDistance'
import { AppData } from '../../types/types'

import { getPointerRay } from '../utility'
/**
 * UI Tool for measurements
 *
 * @extends {MeasureTool}
 */
class MeasureRadiusTool extends MeasureTool {
  /**
   * Creates an instance of MeasureDistanceTool.
   *
   * @param appData - The appData value
   */
  constructor(appData: AppData) {
    super(appData)

    this.geomConstraints = {
      CurveType: ['Circle'],
      SurfaceType: ['Cylinder'],
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

      const xfo = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
      let axisPos
      let edgePos
      const geomParams = this.highlightedItemA_params
      if (geomParams.hasParameter('CurveType')) {
        const curveType = geomParams.getParameter('CurveType').value
        switch (curveType) {
          case 'Circle': {
            const crvToPnt = hitPos.subtract(xfo.tr)
            const radius = geomParams.getParameter('Radius').value * xfo.sc.x
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
      } else if (geomParams.hasParameter('SurfaceType')) {
        const surfaceType = geomParams.getParameter('SurfaceType').value
        switch (surfaceType) {
          case 'Cylinder': {
            const srfToPnt = hitPos.subtract(xfo.tr)
            const zaxis = xfo.ori.getZaxis()
            axisPos = xfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))

            const radius = geomParams.getParameter('Radius').value * xfo.sc.x
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
      const color = this.colorParam.value

      const measurement = new MeasureDistance('MeasureRadius', color, this.appData.sceneUnits)
      measurement.setStartMarkerPos(axisPos)
      measurement.setEndMarkerPos(edgePos)
      measurement.setGeomBuffersVisibility(false)
      this.appData.scene.getRoot().addChild(measurement)

      const measurementChange = new MeasurementChange(measurement)
      UndoRedoManager.getInstance().addChange(measurementChange)

      if (this.highlightedItemA) this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
      event.stopPropagation()
    }
  }
}

export { MeasureRadiusTool }
