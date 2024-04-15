import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Vec3,
  GeomItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  Xfo,
  Quat,
  CompoundGeom,
  StringParameter,
  ParameterOwner,
  XfoParameter,
  Ray,
} from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
import { MeasureTool } from './MeasureTool'
import { MeasureAngle } from './MeasureAngle'

import { getPointerRay } from '../utility'
import { AppData } from '../../types/types'

/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureAngleTool extends MeasureTool {
  highlightedItemAHitPos: any = null
  hitPosA: Vec3
  dragging: boolean

  /**
   * @param appData - The appData value
   */
  constructor(appData: AppData) {
    super(appData)

    this.geomConstraints = {
      SurfaceType: ['Plane', 'Cylinder', 'Cone'],
    }
    this.numStages = 2
  }

  /**
   * @private
   */
  snapToSurface(geomXfo: Xfo, geomParams: ParameterOwner, hitPos: Vec3, pointerRay: Ray, closestTo?: Xfo) {
    const xfo = new Xfo()
    if (geomParams) {
      const surfaceType = (<StringParameter>geomParams.getParameter('SurfaceType')).value
      switch (surfaceType) {
        case 'Plane': {
          const srfToPnt = hitPos.subtract(geomXfo.tr)
          let zaxis = geomXfo.ori.getZaxis()
          if (zaxis.dot(pointerRay.dir) > 0) zaxis = zaxis.negate()

          const surfacePoint = hitPos
          if (closestTo) {
            const normA = zaxis
            const normB = closestTo.ori.getZaxis()
            const vectorAB = closestTo.tr.subtract(hitPos)
            const axis = normA.cross(normB).normalize()
            surfacePoint.addInPlace(axis.scale(vectorAB.dot(axis)))
          }

          xfo.ori.setFromDirectionAndUpvector(zaxis, new Vec3(zaxis.z, zaxis.x, zaxis.y))
          xfo.tr = surfacePoint.subtract(zaxis.scale(srfToPnt.dot(zaxis)))
          break
        }
        case 'Cone': {
          const semiAngle = geomParams.getParameter('SemiAngle').value
          const startRadius = geomParams.getParameter('StartRadius').value * geomXfo.sc.x
          const zaxis = geomXfo.ori.getZaxis()
          const zaxisDist = hitPos.subtract(geomXfo.tr).dot(zaxis)
          const radiusAtPoint = startRadius + Math.tan(semiAngle) * zaxisDist

          let surfacePoint = hitPos
          if (closestTo) {
            const vec2 = closestTo.tr.subtract(geomXfo.tr)
            vec2.subtractInPlace(zaxis.scale(vec2.dot(zaxis)))
            surfacePoint = geomXfo.tr.add(vec2.normalize().scale(radiusAtPoint))
            surfacePoint.addInPlace(zaxis.scale(zaxisDist))
          }
          const vec = surfacePoint.subtract(geomXfo.tr)
          xfo.ori.setFromDirectionAndUpvector(zaxis, vec)

          // We want the Z-axis to be aligned with the normal of the code.
          // the previous line generated an orientation with the z along
          // the length of the cone. Now we rotate by half pi to get a normal aligned
          // z-axis, and then rotate
          const rot = new Quat()
          rot.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5 - semiAngle)
          xfo.ori.multiplyInPlace(rot)

          // Note: we don't know if the surface point is on the inside of the cone
          // or the outside. So we simply check if the resulting normal is facing us
          // or not. If now, we flip the rotation on the Y axis.
          // The DeadEyeBearing is a good sample to test this on.
          if (xfo.ori.getZaxis().dot(pointerRay.dir) > 0) {
            const rot = new Quat()
            rot.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
            xfo.ori.multiplyInPlace(rot)
          }

          xfo.tr = surfacePoint
          break
        }
        case 'Cylinder': {
          const radius = geomParams.getParameter('Radius').value * geomXfo.sc.x
          const zaxis = geomXfo.ori.getZaxis()
          const zaxisDist = hitPos.subtract(geomXfo.tr).dot(zaxis)
          const pointOnAxis = geomXfo.tr.add(zaxis.scale(zaxisDist))

          const axisToPnt = hitPos.subtract(pointOnAxis)
          const length = axisToPnt.length()
          let surfacePoint = pointOnAxis.add(axisToPnt.scale(radius / length))
          if (closestTo) {
            const vec2 = closestTo.tr.subtract(geomXfo.tr)
            vec2.subtractInPlace(zaxis.scale(vec2.dot(zaxis)))
            surfacePoint = geomXfo.tr.add(vec2.normalize().scale(radius))
            surfacePoint.addInPlace(zaxis.scale(zaxisDist))
          }
          const vec = surfacePoint.subtract(pointOnAxis)
          xfo.ori.setFromDirectionAndUpvector(zaxis, vec)
          const rot = new Quat()
          rot.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
          xfo.ori.multiplyInPlace(rot)

          // Note: we don't know if the surface point is on the inside of the cylinder
          // or the outside. So we simply check if the resulting normal is facing us
          // or not. If now, we flip the rotation on the Y axis.
          // The DeadEyeBearing is a good sample to test this on.
          if (xfo.ori.getZaxis().dot(pointerRay.dir) > 0) {
            const rot = new Quat()
            rot.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
            xfo.ori.multiplyInPlace(rot)
          }

          xfo.tr = surfacePoint

          break
        }
        default: {
          console.log('Unhandled Surface Type: ', surfaceType)
        }
      }
    }
    return xfo
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
        const color = this.colorParam.value
        const measurement = new MeasureAngle('MeasureAngle', color)
        this.appData.scene.getRoot().addChild(measurement)

        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))

        const geomXfoA = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
        const xfoA = this.snapToSurface(geomXfoA, this.highlightedItemA_params, hitPos, ray)
        measurement.setXfoA(xfoA)

        this.measurement = measurement
        this.hitPosA = hitPos

        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      if (this.highlightedItemB) {
        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))

        const geomXfoB = this.getGeomXfo(this.highlightedItemB, this.highlightedItemB_componentId)
        const xfoB = this.snapToSurface(geomXfoB, this.highlightedItemB_params, hitPos, ray)

        // Now re-calculate xfoA closest to xfoB
        const geomXfoA = this.getGeomXfo(this.highlightedItemA, this.highlightedItemA_componentId)
        const xfoA = this.snapToSurface(geomXfoA, this.highlightedItemA_params, this.hitPosA, ray, xfoB)

        const measurement = <MeasureAngle>this.measurement
        measurement.setXfoA(xfoA)
        measurement.setXfoB(xfoB)

        const measurementChange = new MeasurementChange(measurement)
        UndoRedoManager.getInstance().addChange(measurementChange)

        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
          this.highlightedItemA = null
        }
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
          this.highlightedItemB = null
        }
        this.stage = 0
        event.stopPropagation()
      }
    }
  }

  /**
   *
   *
   * @param event - The event value
  onPointerMove(event: ZeaPointerEvent): void {
    // skip if the alt key is held. Allows the camera tool to work
    if (
      ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.altKey) ||
      (event instanceof ZeaMouseEvent && event.button !== 0)
    )
      return

    if (this.stage == 0) {
      if (event.intersectionData && event.intersectionData.geomItem instanceof GeomItem) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (this.checkSurface(geomItem)) {
          if (geomItem != this.highlightedItemA) {
            if (this.highlightedItemA) {
              this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
            }
            this.highlightedItemA = geomItem
            this.highlightedItemA_componentId = event.intersectionData.componentId
            const color = this.colorParam.value
            color.a = 0.2
            this.highlightedItemA.addHighlight(this.highlightedItemA_highlightKey, color, true)
          }
        }
      } else {
        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
          this.highlightedItemA = null
        }
      }
    } else if (this.stage == 1) {
      if (event.intersectionData && event.intersectionData.geomItem instanceof GeomItem) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (geomItem != this.highlightedItemA && geomItem != this.highlightedItemB && this.checkSurface(geomItem)) {
          if (this.highlightedItemB) {
            this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
          }
          this.highlightedItemB = geomItem
          this.highlightedItemB_componentId = event.intersectionData.componentId

          const color = this.colorParam.value.clone()
          color.a = 0.2
          this.highlightedItemB.addHighlight(this.highlightedItemB_highlightKey, color, true)
        }
      } else {
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
          this.highlightedItemB = null
        }
      }
    }
  }
   */
}

export { MeasureAngleTool }
