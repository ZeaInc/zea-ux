import {
  BaseTool,
  GeomItem,
  IntersectionData,
  VRViewport,
  XRController,
  XRPoseEvent,
  Xfo,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../types/types'
import { ToolManager } from './ToolManager'
import { line, lineMaterial } from '../helpers/line'
import { CustomGeom } from './CreateTools/CustomGeom'
import DeleteGeomChange from './CreateTools/Change/DeleteGeomChange'
import { Change, UndoRedoManager } from '../UndoRedo'

class DeleteGeomsTool extends BaseTool {
  private appData: AppData

  private vrViewport: VRViewport
  private prevCursor: string

  private defaultTaycastDist = 0.0
  public raycastDist = 20.0
  private bindControllerId: number

  private pointerButtonHeld = false
  private change: Change
  private pointerGeomItems: GeomItem[] = []

  constructor(appData: AppData, toolManager: ToolManager) {
    super()
    this.appData = appData

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (xrvp instanceof VRViewport) {
        this.vrViewport = xrvp
      }
    })
    this.toolManager = toolManager
  }

  /**
   * Enables tools usage. This method is called by either the Viewport when a tool is removed, or the ToolManage if it is installed.
   */
  activateTool(): void {
    super.activateTool()

    if (this.appData && this.appData.renderer) {
      this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
      this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'
    }

    const bindController = (controller: XRController) => {
      // The tool might already be deactivated.
      if (this.pointerGeomItems[controller.id]) return

      this.defaultTaycastDist = controller.raycastDist
      controller.raycastDist = this.raycastDist

      const pointerGeomItem = new GeomItem('PointerRay', line, lineMaterial)
      pointerGeomItem.setSelectable(false)
      const pointerXfo = new Xfo()
      pointerXfo.sc.set(1, 1, this.raycastDist)
      pointerGeomItem.localXfoParam.value = pointerXfo
      controller.tipItem.addChild(pointerGeomItem, false)
      this.pointerGeomItems[controller.id] = pointerGeomItem
    }

    if (this.vrViewport) {
      for (const controller of this.vrViewport.getControllers()) {
        bindController(controller)
      }
      this.bindControllerId = this.vrViewport.on('controllerAdded', (event) => bindController(event.controller))
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
    const unbindController = (controller: XRController) => {
      if (!this.pointerGeomItems[controller.id]) return
      controller.tipItem.removeChildByHandle(this.pointerGeomItems[controller.id])

      controller.raycastDist = this.defaultTaycastDist
      this.pointerGeomItems[controller.id] = null
    }
    if (this.vrViewport) {
      for (const controller of this.vrViewport.getControllers()) {
        unbindController(controller)
      }
      this.vrViewport.removeListenerById('controllerAdded', this.bindControllerId)
    }
  }

  private setPointerLength(length: number, controller: XRController): void {
    const pointerGeomItem = this.pointerGeomItems[controller.id]
    if (pointerGeomItem) {
      const pointerLocalXfo = pointerGeomItem.localXfoParam.value

      pointerLocalXfo.sc.set(1, 1, length / controller.getTipXfo().sc.z)
      pointerGeomItem.localXfoParam.value = pointerLocalXfo
    }
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
