import {
  GeomItem,
  IntersectionData,
  XRController,
  XRPoseEvent,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../types/types'
import { CustomGeom } from './CreateTools/CustomGeom'
import DeleteGeomChange from './CreateTools/Change/DeleteGeomChange'
import { Change, UndoRedoManager } from '../UndoRedo'
import { PointerTool } from './VRTools/PointerTool'

class DeleteGeomsTool extends PointerTool {
  private pointerButtonHeld = false
  private change: Change

  constructor(appData: AppData) {
    super(appData)
  }

  private handleGeometryIntersection(intersectionData: IntersectionData) {
    const geomItem = intersectionData.geomItem as GeomItem
    if (geomItem instanceof CustomGeom) {
      const change = new DeleteGeomChange(geomItem)
      this.change.addSecondaryChange(change)
    }
  }

  /**
   * Event fired when a pointing device is moved
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent) {
      if (this.pointerButtonHeld) {
        if (event.intersectionData) {
          this.handleGeometryIntersection(event.intersectionData)
        }
      }
    } else if (event instanceof XRPoseEvent) {
      event.controllers.forEach((controller: XRController) => {
        const intersectionData = controller.getGeomItemAtTip()
        if (intersectionData) {
          this.handleGeometryIntersection(intersectionData)
          this.setPointerLength(intersectionData.dist, controller)
        } else {
          this.setPointerLength(this.raycastDist, controller)
        }
      })
      event.stopPropagation()
    }
  }

  onPointerDown(event: ZeaPointerEvent) {
    this.pointerButtonHeld = true

    this.change = new Change('Delete Geoms')
    event.setCapture(this)
    event.stopPropagation()
  }

  onPointerUp(event: ZeaPointerEvent) {
    this.pointerButtonHeld = false

    if (this.change.secondaryChanges.length > 0) {
      UndoRedoManager.getInstance().addChange(this.change)
    }
    event.releaseCapture()
  }
}

export { DeleteGeomsTool }
