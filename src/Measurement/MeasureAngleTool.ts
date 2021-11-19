import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3, Color, ColorParameter, BaseTool, GeomItem, Xfo, Quat } from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
import { MeasureAngle } from './MeasureAngle'
import { AppData } from '../../types/temp'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureAngleTool extends BaseTool {
  appData: AppData
  colorParam = new ColorParameter('Color', new Color('#F9CE03'))
  measurementChange: MeasurementChange = null
  highlightedItemA = null
  highlightedItemB = null
  highlightedItemAHitPos = null
  stage: number = 0
  prevCursor
  hitPosA
  measurement
  geomItemA: GeomItem
  dragging: boolean
  /**
   * Creates an instance of MeasureAngleTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super()

    this.addParameter(this.colorParam)
    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
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
   * Checks to see if the surface is appropriate for this kind of measurement.
   * @param {GeomItem} geomItem - The geomItem to check
   * @return {boolean}
   */
  checkSurface(geomItem) {
    const surfaceTypeParm = geomItem.getParameter('SurfaceType')
    return (
      surfaceTypeParm &&
      (surfaceTypeParm.getValue() == 'Plane' ||
        surfaceTypeParm.getValue() == 'Cone' ||
        surfaceTypeParm.getValue() == 'Cylinder')
    )
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0) || !event.intersectionData) return

    const getSurfaceXfo = (geomItem, hitPos, closestTo?) => {
      const xfo = new Xfo()
      const surfaceTypeParm = geomItem.getParameter('SurfaceType')
      if (surfaceTypeParm) {
        const surfaceType = surfaceTypeParm.getValue()
        switch (surfaceType) {
          case 'Plane': {
            const geomMat = geomItem.getParameter('GeomMat').getValue()
            const srfToPnt = hitPos.subtract(geomMat.translation)
            let zaxis = geomMat.zAxis.clone()
            if (zaxis.dot(event.pointerRay.dir) > 0) zaxis = zaxis.negate()

            const hitPos2 = hitPos
            if (closestTo) {
              const normA = zaxis
              const normB = closestTo.ori.getZaxis()
              const vectorAB = closestTo.tr.subtract(hitPos)
              const axis = normA.cross(normB).normalize()
              hitPos2.addInPlace(axis.scale(vectorAB.dot(axis)))
            }

            xfo.ori.setFromDirectionAndUpvector(zaxis, new Vec3(zaxis.z, zaxis.x, zaxis.y))
            xfo.tr = hitPos2.subtract(zaxis.scale(srfToPnt.dot(zaxis)))
            break
          }
          case 'Cone': {
            const globalXfo = geomItem.globalXfoParam.value
            const semiAngle = geomItem.getParameter('SemiAngle').getValue()
            const startRadius = geomItem.getParameter('StartRadius').getValue()
            const zaxis = globalXfo.ori.getZaxis()
            const zaxisDist = hitPos.subtract(globalXfo.tr).dot(zaxis)
            const radiusAtPoint = startRadius + Math.tan(semiAngle) * zaxisDist
            let hitPos2 = hitPos
            if (closestTo) {
              const vec2 = closestTo.tr.subtract(globalXfo.tr)
              vec2.subtractInPlace(zaxis.scale(vec2.dot(zaxis)))
              hitPos2 = globalXfo.tr.add(vec2.normalize().scale(radiusAtPoint))
              hitPos2.addInPlace(zaxis.scale(zaxisDist))
            }
            const vec = hitPos2.subtract(globalXfo.tr)
            xfo.ori.setFromDirectionAndUpvector(zaxis, vec)
            const rot = new Quat()
            rot.setFromAxisAndAngle(new Vec3(1, 0, 0), semiAngle)
            xfo.ori.multiplyInPlace(rot)
            xfo.tr = hitPos2

            const zaxis2 = globalXfo.ori.getZaxis()
            const angle = zaxis2.angleTo(xfo.ori.getZaxis())
            console.log(angle, semiAngle)
            break
          }
          case 'Cylinder': {
            const globalXfo = geomItem.globalXfoParam.value
            const radius = geomItem.getParameter('Radius').getValue() * globalXfo.sc.x
            const zaxis = globalXfo.ori.getZaxis()
            const zaxisDist = hitPos.subtract(globalXfo.tr).dot(zaxis)
            const pointOnAxis = globalXfo.tr.add(zaxis.scale(zaxisDist))

            const axisToPnt = hitPos.subtract(pointOnAxis)
            const length = axisToPnt.length()
            let hitPos2 = pointOnAxis.add(axisToPnt.scale(radius / length))
            if (closestTo) {
              const vec2 = closestTo.tr.subtract(globalXfo.tr)
              vec2.subtractInPlace(zaxis.scale(vec2.dot(zaxis)))
              hitPos2 = globalXfo.tr.add(vec2.normalize().scale(radius))
              hitPos2.addInPlace(zaxis.scale(zaxisDist))
            }
            const vec = hitPos2.subtract(globalXfo.tr)
            xfo.ori.setFromDirectionAndUpvector(zaxis, vec)
            const rot = new Quat()
            rot.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
            xfo.ori.multiplyInPlace(rot)
            xfo.tr = hitPos2
            break
          }
          default: {
            console.log('Unhandled Surface Type: ', surfaceType)
          }
        }
      }
      return xfo
    }

    if (this.stage == 0) {
      const { geomItem } = event.intersectionData
      if (this.checkSurface(geomItem)) {
        const color = this.colorParam.getValue()
        this.measurement = new MeasureAngle('MeasureAngle', color)
        this.appData.scene.getRoot().addChild(this.measurement)

        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const xfoA = getSurfaceXfo(geomItem, hitPos)
        this.measurement.setXfoA(xfoA)

        this.geomItemA = geomItem
        this.hitPosA = hitPos

        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      const { geomItem } = event.intersectionData
      if (this.checkSurface(geomItem)) {
        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const xfoB = getSurfaceXfo(geomItem, hitPos)
        // this.measurement.setXfoB(xfoB)
        const xfoA = getSurfaceXfo(this.geomItemA, this.hitPosA, xfoB)
        this.measurement.setXfoA(xfoA)

        // const xfoB2 = getSurfaceXfo(geomItem, hitPos, xfoA)
        this.measurement.setXfoB(xfoB)

        const measurementChange = new MeasurementChange(this.measurement)
        UndoRedoManager.getInstance().addChange(measurementChange)

        if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measure', true)
        if (this.highlightedItemB) this.highlightedItemB.removeHighlight('measure', true)

        this.stage = 0
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
    if (event.altKey || (event.pointerType === 'mouse' && event.button !== 0)) return

    if (this.stage == 0) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (this.checkSurface(geomItem)) {
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
    } else if (this.stage == 1) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem != this.highlightedItemA && geomItem != this.highlightedItemB && this.checkSurface(geomItem)) {
          if (this.highlightedItemB) {
            this.highlightedItemB.removeHighlight('measure', true)
          }
          this.highlightedItemB = geomItem

          const color = this.colorParam.getValue().clone()
          color.a = 0.2
          this.highlightedItemB.addHighlight('measure', color, true)
        }
      } else {
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight('measure', true)
          this.highlightedItemB = null
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
      this.measurementChange = null
      if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measure', true)
      event.stopPropagation()
    }
  }
}

export { MeasureAngleTool }
