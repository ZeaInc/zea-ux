import { ColorParameter, BaseTool, TreeItem, GeomItem, Color } from '@zeainc/zea-engine'
import { MeasureDistance } from './MeasureDistance'
import { Measure } from './Measure'
import { MeasurementChange } from './MeasurementChange'
import { AppData } from '../../types/types'

import { getPointerRay } from '../utility'

/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureTool extends BaseTool {
  appData: AppData
  colorParam: ColorParameter

  measurement: Measure
  measurementChange: MeasurementChange
  highlightedItemA: GeomItem
  highlightedItemB: GeomItem
  stage: number = 0
  prevCursor: string

  /**
   * Creates an instance of MeasureDistanceTool.
   *
   * @param appData - The appData value
   */
  constructor(appData: AppData) {
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

    if (this.stage != 0) {
      const parentItem = <TreeItem>this.measurement.getOwner()
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
}

export { MeasureTool }
