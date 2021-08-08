import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Ray, Vec3, Color, ColorParameter, BaseTool, GeomItem, Xfo } from '@zeainc/zea-engine'
import { MeasurementChange } from './MeasurementChange'
import { MeasureAngle } from './MeasureAngle'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureAngleTool extends BaseTool {
  /**
   * Creates an instance of MeasureAngleTool.
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
    this.highlightedItemAHitPos = null
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

      if (this.highlightedItemB) {
        this.highlightedItemB.removeHighlight('measure', true)
        this.highlightedItemB = null
      }
      if (this.highlightedItemA) {
        this.highlightedItemA.removeHighlight('measure', true)
        this.highlightedItemA = null
      }
      event.stopPropagation()
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey || !event.intersectionData) return
    console.log('onPointerDown')
    const getSurfaceXfo = (geomItem, hitPos) => {
      const xfo = new Xfo()
      if (geomItem.hasParameter('SurfaceType')) {
        const surfaceType = geomItem.getParameter('SurfaceType').getValue()
        switch (surfaceType) {
          case 'Plane': {
            const geomMat = geomItem.getParameter('GeomMat').getValue()
            const srfToPnt = hitPos.subtract(geomMat.translation)
            let zaxis = geomMat.zAxis.clone()
            if (zaxis.dot(event.pointerRay.dir) > 0) zaxis = zaxis.negate()
            xfo.ori.setFromDirectionAndUpvector(zaxis, new Vec3(zaxis.z, zaxis.x, zaxis.y))
            xfo.tr = hitPos.subtract(zaxis.scale(srfToPnt.dot(zaxis)))
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
      if (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Plane') {
        const color = this.colorParam.getValue()
        this.measurement = new MeasureAngle('MeasureAngle', color)
        this.appData.scene.getRoot().addChild(this.measurement)

        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const xfoA = getSurfaceXfo(geomItem, hitPos)
        this.measurement.setXfoA(xfoA)

        this.stage++
        event.stopPropagation()
      }
    } else if (this.stage == 1) {
      const { geomItem } = event.intersectionData
      if (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Plane') {
        const ray = event.pointerRay
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        const xfoA = getSurfaceXfo(geomItem, hitPos)
        this.measurement.setXfoB(xfoA)

        const measurementChange = new MeasurementChange(this.measurement)
        UndoRedoManager.getInstance().addChange(measurementChange)

        if (this.highlightedItemA) this.highlightedItemA.removeHighlight('measure', true)
        if (this.highlightedItemB) this.highlightedItemB.removeHighlight('measureB', true)

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
    if (event.altKey) return
    if (this.stage == 0) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Plane') {
          if (geomItem != this.highlightedItemA) {
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
    } else if (this.stage == 1) {
      if (event.intersectionData) {
        const { geomItem } = event.intersectionData
        if (geomItem.hasParameter('SurfaceType') && geomItem.getParameter('SurfaceType').getValue() == 'Plane') {
          if (this.highlightedItemB) {
            this.highlightedItemB.removeHighlight('measureB', true)
          }
          this.highlightedItemB = geomItem
          this.highlightedItemB.addHighlight('measureB', new Color(1, 1, 1, 0.2), true)
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
