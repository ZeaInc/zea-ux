import {
  BaseGeom,
  BaseTool,
  Color,
  Cylinder,
  FlatSurfaceMaterial,
  GeomItem,
  LinesMaterial,
  Material,
  VRViewport,
  XRController,
  XRPoseEvent,
  Xfo,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../../types/types'
import { line } from '../../helpers/line'

class PointerTool extends BaseTool {
  protected appData: AppData

  protected vrViewport: VRViewport
  protected prevCursor: string

  public pointerThickness = 0.0
  public pointerColor = new Color(0.2, 1.0, 0.2)

  private geom: BaseGeom
  private material: FlatSurfaceMaterial | LinesMaterial

  protected defaultTaycastDist = 0.0
  public raycastDist = 20.0
  protected bindControllerId: number
  protected pointerGeomItems: GeomItem[] = []

  constructor(appData: AppData) {
    super()
    this.appData = appData

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (xrvp instanceof VRViewport) {
        this.vrViewport = xrvp
      }
    })
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
    if (this.pointerThickness > 0) {
      if (!this.geom || this.geom instanceof Cylinder) {
        this.geom = new Cylinder(this.pointerThickness, 1.0, 6)
        this.material = new FlatSurfaceMaterial('line')
      }
    } else {
      this.geom = line
      this.material = new LinesMaterial('line')
    }
    this.material.baseColorParam.value = this.pointerColor

    const bindController = (controller: XRController) => {
      // The tool might already be deactivated.
      if (this.pointerGeomItems[controller.id]) return

      this.defaultTaycastDist = controller.raycastDist
      controller.raycastDist = this.raycastDist

      const pointerGeomItem = new GeomItem('PointerRay', this.geom, this.material)
      pointerGeomItem.setSelectable(false)
      const pointerXfo = new Xfo()
      pointerXfo.sc.set(1, 1, this.raycastDist)
      pointerGeomItem.localXfoParam.value = pointerXfo
      controller.tipItem.addChild(pointerGeomItem, false)
      this.pointerGeomItems[controller.id] = pointerGeomItem
    }

    if (this.vrViewport) {
      for (const controller of this.vrViewport.controllers) {
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
      for (const controller of this.vrViewport.controllers) {
        unbindController(controller)
      }
      this.vrViewport.removeListenerById('controllerAdded', this.bindControllerId)
    }
  }

  protected setPointerLength(length: number, controller: XRController): void {
    const pointerGeomItem = this.pointerGeomItems[controller.id]
    if (pointerGeomItem) {
      const pointerLocalXfo = pointerGeomItem.localXfoParam.value

      pointerLocalXfo.sc.set(1, 1, length / controller.getTipXfo().sc.z)
      pointerGeomItem.localXfoParam.value = pointerLocalXfo
    }
  }

  /**
   * Event fired when a pointing device is moved
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event instanceof XRPoseEvent) {
      event.controllers.forEach((controller: XRController) => {
        const intersectionData = controller.getGeomItemAtTip()
        if (intersectionData) {
          this.setPointerLength(intersectionData.dist, controller)
        } else {
          this.setPointerLength(this.raycastDist, controller)
        }
      })
      event.stopPropagation()
    }
  }
}

export { PointerTool }
