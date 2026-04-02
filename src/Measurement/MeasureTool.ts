import {
  ColorParameter,
  BaseTool,
  TreeItem,
  GeomItem,
  Color,
  CompoundGeom,
  ParameterOwner,
  XfoParameter,
  CADBody,
  Xfo,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  CADAsset,
  BaseToolEventMap,
  BaseEvent,
} from '@zeainc/zea-engine'
import { Measure } from './Measure'
import { MeasurementChange } from './MeasurementChange'
import { AppData } from '../../types/types'

interface MeasureToolEventMap extends BaseToolEventMap {
  actionFinished: BaseEvent
}

/**
 * UI Tool for measurements
 *
 * @extends {BaseTool}
 */
class MeasureTool extends BaseTool {
  protected appData: AppData
  colorParam: ColorParameter
  parentItem: TreeItem

  protected measurement: Measure
  protected measurementChange: MeasurementChange
  protected highlightedItemA: GeomItem
  protected highlightedItemA_params: ParameterOwner
  protected highlightedItemA_componentId: number
  protected highlightedItemA_highlightKey: string
  protected highlightedItemB: GeomItem
  protected highlightedItemB_params: ParameterOwner
  protected highlightedItemB_componentId: number
  protected highlightedItemB_highlightKey: string

  protected stage: number = 0
  protected numStages: number = 1
  private prevCursor: string

  protected geomConstraints: Record<string, string[]> = {}

  /**
   * Creates an instance of MeasureDistanceTool.
   *
   * @param appData - The appData value
   */
  constructor(appData: AppData, parentItem: TreeItem) {
    super()

    this.parentItem = parentItem
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

    if (this.highlightedItemB) {
      this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
      this.highlightedItemB = null
    }
    if (this.highlightedItemA) {
      this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
      this.highlightedItemA = null
    }

    if (this.stage != 0) {
      const parentItem = <TreeItem>this.measurement.getOwner()
      parentItem.removeChild(parentItem.getChildIndex(this.measurement))
      this.measurement = null

      this.stage = 0
    }
  }

  // Overload this method in subclasses if needed to customize how CAD asset metadata is loaded.
  protected async loadCADAssetMetadata(cadAsset: CADAsset): Promise<void> {
    await cadAsset.loadMetadata()
  }

  /**
   * @param geomItem
   * @returns
   */
  protected getGeomParams(geomItem: GeomItem, componentId: number = -1): Promise<ParameterOwner> {
    return new Promise<ParameterOwner>((resolve, reject) => {
      // @ts-ignore
      const cadAsset = geomItem.assetItem
      if (geomItem instanceof CADBody && cadAsset instanceof CADAsset) {
        this.loadCADAssetMetadata(cadAsset).then(() => {
          const geom = geomItem.geomParam.value
          if (geom instanceof CompoundGeom) {
            resolve(geom.subGeoms[componentId])
          } else {
            resolve(geomItem)
          }
        })
      } else {
        reject('Geom Item is not a CADBody')
      }
    })
  }

  protected getGeomXfo(geomItem: GeomItem, componentId: number = -1): Xfo {
    const geom = geomItem.geomParam.value
    if (geom instanceof CompoundGeom) {
      const subGeom = geom.subGeoms[componentId]
      const subGeomXfo = (<XfoParameter>subGeom.getParameter('Xfo')).value
      const globalXfo = geomItem.globalXfoParam.value
      const geomOffsetXfo = geomItem.geomOffsetXfoParam.value
      return globalXfo.multiply(geomOffsetXfo).multiply(subGeomXfo)
    }
    return geomItem.globalXfoParam.value
  }

  /**
   * Checks to see if the surface is appropriate for this kind of measurement.
   * @param geomItem - The geomItem to check
   * @return {boolean}
   */
  private checkGeom(geomItem: GeomItem, componentId: number = -1): Promise<ParameterOwner | null> {
    return new Promise<ParameterOwner | null>((resolve) => {
      this.getGeomParams(geomItem, componentId).then((geomParams) => {
        if (geomParams) {
          for (let key in this.geomConstraints) {
            const param = geomParams.getParameter(key)
            if (param && this.geomConstraints[key].includes(param.value)) {
              resolve(geomParams)
            }
          }
          resolve(null)
        } else {
          resolve(null)
        }
      })
    })
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

    if (this.stage == 0) {
      if (event.intersectionData && event.intersectionData.geomItem instanceof GeomItem) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        const componentId = event.intersectionData.componentId
        if (geomItem instanceof CADBody && geomItem.geomParam.value instanceof CompoundGeom) {
          const cadBody: CADBody = geomItem
          if (!cadBody.shattered) {
            cadBody.setShatterState(true)
            return
          }
        }

        this.checkGeom(geomItem, componentId).then((geomParams: ParameterOwner) => {
          if (geomParams) {
            if (geomItem != this.highlightedItemA || componentId != this.highlightedItemA_componentId) {
              if (this.highlightedItemA) {
                this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
              }
              this.highlightedItemA = geomItem
              this.highlightedItemA_params = geomParams
              this.highlightedItemA_componentId = componentId
              this.highlightedItemA_highlightKey = 'measure:' + componentId
              const color = this.colorParam.value
              color.a = 0.2
              this.highlightedItemA.addHighlight(this.highlightedItemA_highlightKey, color, true)
            }
          }
        })
      } else {
        if (this.highlightedItemA) {
          this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
          if (this.highlightedItemA_componentId >= 0) {
            const cadBody = <CADBody>this.highlightedItemA
            if (cadBody.shattered) cadBody.setShatterState(false)
          }
          this.highlightedItemA = null
        }
      }
      event.stopPropagation()
    } else {
      if (event.intersectionData && event.intersectionData.geomItem instanceof GeomItem) {
        const geomItem = <GeomItem>event.intersectionData.geomItem
        const componentId = event.intersectionData.componentId
        if (geomItem instanceof CADBody && geomItem.geomParam.value instanceof CompoundGeom) {
          const cadBody: CADBody = geomItem
          if (!cadBody.shattered) {
            cadBody.setShatterState(true)
            return
          }
        }

        if (
          (geomItem != this.highlightedItemA || componentId != this.highlightedItemA_componentId) &&
          (geomItem != this.highlightedItemB || componentId != this.highlightedItemB_componentId)
        ) {
          this.checkGeom(geomItem, componentId).then((geomParams: ParameterOwner) => {
            if (geomParams) {
              if (this.highlightedItemB) {
                this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
                this.highlightedItemB = null
              }

              this.highlightedItemB = geomItem
              this.highlightedItemB_params = geomParams
              this.highlightedItemB_componentId = componentId
              this.highlightedItemB_highlightKey = 'measure:' + componentId
              const color = this.colorParam.value.clone()
              color.a = 0.2
              this.highlightedItemB.addHighlight(this.highlightedItemB_highlightKey, color, true)
            }
          })
        }
      } else {
        if (this.highlightedItemB) {
          this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
          if (this.highlightedItemA_componentId >= 0) {
            const cadBody = <CADBody>this.highlightedItemA
            if (cadBody.shattered) cadBody.setShatterState(false)
          }
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
  onPointerUp(event: ZeaPointerEvent): void {
    if (this.stage == this.numStages) {
      this.measurementChange = null

      if (this.highlightedItemA) {
        this.highlightedItemA.removeHighlight(this.highlightedItemA_highlightKey, true)
        if (this.highlightedItemA_componentId >= 0) {
          const cadBody = <CADBody>this.highlightedItemA
          if (cadBody.shattered) cadBody.setShatterState(false)
        }
        this.highlightedItemA = null
      }

      if (this.highlightedItemB) {
        this.highlightedItemB.removeHighlight(this.highlightedItemB_highlightKey, true)
        if (this.highlightedItemB_componentId >= 0) {
          const cadBody = <CADBody>this.highlightedItemB
          if (cadBody.shattered) cadBody.setShatterState(false)
        }
        this.highlightedItemB = null
      }
      event.stopPropagation()
    }
  }

  // #region Event Emitter Interfaces

  on<K extends keyof MeasureToolEventMap>(eventName: K, callback: (event?: MeasureToolEventMap[K]) => void): number {
    return super.on(eventName as any, callback)
  }

  off<K extends keyof MeasureToolEventMap>(
    eventName: K,
    listenerOrId: number | ((event?: MeasureToolEventMap[K]) => void)
  ) {
    return super.off(eventName as any, listenerOrId)
  }

  emit<K extends keyof MeasureToolEventMap>(eventName: K, event?: MeasureToolEventMap[K]): void {
    super.emit(eventName as any, event)
  }

  // #endregion
}

export { MeasureTool }
