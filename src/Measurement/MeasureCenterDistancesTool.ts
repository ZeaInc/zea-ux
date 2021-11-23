import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import {
  Ray,
  Vec3,
  Color,
  ColorParameter,
  BaseTool,
  GeomItem,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'
import { MeasureDistance } from './MeasureDistance'
import { MeasurementChange } from './MeasurementChange'
import { AppData } from '../../types/temp'

import { getPointerRay } from '../utility'
/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureCenterDistancesTool extends BaseTool {
  colorParam
  appData: AppData
  measurementChange
  highlightedItemA
  highlightedItemB
  stage
  prevCursor
  measurement
  /**
   * Creates an instance of MeasureCenterDistancesTool.
   *
   * @param {object} appData - The appData value
   */
  constructor(appData) {
    super()

    this.colorParam = new ColorParameter('Color', new Color('#F9CE03'))
    this.addParameter(this.colorParam)
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
   * @param {string} key
   * @private
   */
  highlightEdge(geomItem: GeomItem, key: string): void {}

  /**
   * @param {GeomItem} geomItem
   * @param {Vec3} pos
   * @return {Vec3}
   * @private
   */
  snapToParametricCenter(geomItem: GeomItem, pos: Vec3) {
    const xfo = geomItem.globalXfoParam.value
    if (geomItem.hasParameter('CurveType')) {
      const curveType = geomItem.getParameter('CurveType').getValue()

      switch (curveType) {
        case 'Circle': {
          const crvToPnt = pos.subtract(xfo.tr)
          const zaxis = xfo.ori.getZaxis()
          return xfo.tr.add(zaxis.scale(crvToPnt.dot(zaxis)))
        }
        default: {
          console.log('Unhandled Edge Type: ', curveType)
        }
      }
    } else if (geomItem.hasParameter('SurfaceType')) {
      const surfaceType = geomItem.getParameter('SurfaceType').getValue()

      switch (surfaceType) {
        case 'Cylinder':
        case 'Cone': {
          const srfToPnt = pos.subtract(xfo.tr)
          const zaxis = xfo.ori.getZaxis()
          return xfo.tr.add(zaxis.scale(srfToPnt.dot(zaxis)))
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
  onPointerDown(event: ZeaPointerEvent) {
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

        const startPos = this.snapToParametricCenter(this.highlightedItemA, hitPos)
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
        const ray = getPointerRay(event)
        const hitPos = ray.start.add(ray.dir.scale(event.intersectionData.dist))
        let endPos = this.snapToParametricCenter(this.highlightedItemB, hitPos)
        const startPos = this.snapToParametricCenter(this.highlightedItemA, endPos)
        endPos = this.snapToParametricCenter(this.highlightedItemB, startPos)
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
   * Checks to see if the surface is appropriate for this kind of measurement.
   * @param {GeomItem} geomItem - The geomItem to check
   * @return {boolean}
   */
  checkGeom(geomItem: GeomItem) {
    if (geomItem.hasParameter('CurveType')) {
      const curveTypeParm = geomItem.getParameter('CurveType')
      return curveTypeParm.getValue() == 'Circle'
    }
    if (geomItem.hasParameter('SurfaceType')) {
      const surfaceTypeParm = geomItem.getParameter('SurfaceType')
      return surfaceTypeParm.getValue() == 'Cone' || surfaceTypeParm.getValue() == 'Cylinder'
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerMove(event: ZeaPointerEvent) {
    // skip if the alt key is held. Allows the camera tool to work
    if (
      ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.altKey) ||
      (event instanceof ZeaMouseEvent && event.button !== 0)
    )
      return

    if (this.stage == 0) {
      if (event.intersectionData) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        if (geomItem != this.highlightedItemA && this.checkGeom(geomItem)) {
          if (this.highlightedItemA) {
            this.highlightedItemA.removeHighlight('measure', true)
          }
          this.highlightedItemA = geomItem

          const color = this.colorParam.getValue()
          color.a = 0.2
          this.highlightedItemA.addHighlight('measure', color, true)
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
        if (geomItem != this.highlightedItemA && geomItem != this.highlightedItemB && this.checkGeom(geomItem)) {
          if (this.highlightedItemB) {
            this.highlightedItemB.removeHighlight('measure', true)
            this.highlightedItemB = null
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
      event.stopPropagation()
    }
  }

  /**
   *
   *
   * @param {MouseEvent|TouchEvent} event - The event value
   */
  onPointerUp(event: ZeaPointerEvent) {}
}

export { MeasureCenterDistancesTool }
