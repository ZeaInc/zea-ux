import {
  Color,
  GeomItem,
  IntersectionData,
  XRController,
  XRControllerEvent,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../types/types'
import { CustomGeom } from './CreateTools/CustomGeom'
import { Change, TreeItemsRemoveChange, UndoRedoManager } from '../UndoRedo'
import { PointerTool } from './VRTools/PointerTool'

class DeleteGeomsTool extends PointerTool {
  private change: Change
  private highlightedGeom: GeomItem
  private highlightColor = new Color(1, 0, 0, 0.4)
  public pointerButton = 0

  constructor(appData: AppData) {
    super(appData)
  }

  activateTool(): void {
    super.activateTool()
  }

  private handleGeometryIntersection(intersectionData: IntersectionData) {
    if (intersectionData) {
      const geomItem = intersectionData.geomItem as GeomItem
      if (geomItem instanceof CustomGeom) {
        if (this.highlightedGeom && this.highlightedGeom != geomItem) {
          this.highlightedGeom.removeHighlight('DeleteGeomsTool')
          this.highlightedGeom = undefined
        }
        if (this.change) {
          const change = new TreeItemsRemoveChange([geomItem], this.appData)

          this.change.addSecondaryChange(change)
        } else {
          geomItem.addHighlight('DeleteGeomsTool', this.highlightColor)
          this.highlightedGeom = geomItem
        }
      }
    } else if (this.highlightedGeom) {
      this.highlightedGeom.removeHighlight('DeleteGeomsTool')
    }
  }

  onPointerDown(event: ZeaPointerEvent) {
    if (event instanceof XRControllerEvent && event.button != this.pointerButton) {
      return
    }
    this.change = new Change('Delete Geoms')
    event.setCapture(this)
    event.stopPropagation()
  }

  protected checkPointerIntersection(controller: XRController): void {
    const intersectionData = controller.getGeomItemAtTip()
    this.handleGeometryIntersection(intersectionData)
    if (intersectionData) {
      this.setPointerLength(intersectionData.dist, controller)
    } else {
      this.setPointerLength(this.raycastDist, controller)
    }
  }

  onPointerMove(event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent) {
      this.handleGeometryIntersection(event.intersectionData)
    } else {
      super.onPointerMove(event)
    }
  }

  onPointerUp(event: ZeaPointerEvent) {
    if (this.change && this.change.secondaryChanges.length > 0) {
      UndoRedoManager.getInstance().addChange(this.change)
      this.change = null
    }
    event.releaseCapture()
  }
}

export { DeleteGeomsTool }
