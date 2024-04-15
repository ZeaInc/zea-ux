import {
  BaseTool,
  Circle,
  GeomItem,
  Lines,
  LinesSphere,
  Quat,
  Ray,
  TreeItem,
  VRViewport,
  Vec3,
  XRController,
  XRControllerEvent,
  XRPoseEvent,
  XRViewManipulator,
  Xfo,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../../types/types'
import { ToolManager } from '../ToolManager'
import { line, lineMaterial } from '../../helpers/line'

class DropUserTool extends BaseTool {
  private appData: AppData
  private toolManager: ToolManager

  private vrViewport: VRViewport
  private prevCursor: string

  private defaultTaycastDist = 0.0
  public raycastDist = 20.0
  private bindControllerId: number

  private pointerGeomItems: GeomItem[] = []
  private dropAvatar = new TreeItem('dropAvatar')
  private floorPlane = new Ray(new Vec3(), new Vec3(0, 0, 1))

  constructor(appData: AppData, toolManager: ToolManager) {
    super()
    this.appData = appData

    const linesSphere = new LinesSphere(1, 32)
    const headGeomItem = new GeomItem('PointerRay', linesSphere, lineMaterial)
    headGeomItem.setSelectable(false)
    const headXfo = new Xfo()
    headXfo.sc.set(0.17 * 0.5, 0.17 * 0.5, 0.21 * 0.5) // Facing +y
    headXfo.tr.set(0, 0, 1.5)
    headGeomItem.localXfoParam.value = headXfo
    this.dropAvatar.addChild(headGeomItem, false)

    const torosGeomItem = new GeomItem('PointerRay', linesSphere, lineMaterial)
    torosGeomItem.setSelectable(false)
    const torsoXfo = new Xfo()
    torsoXfo.sc.set(0.28 * 0.5, 0.28 * 0.5, 0.6 * 0.5) // Facing +y
    torsoXfo.tr.set(0, 0, 1.0)
    torosGeomItem.localXfoParam.value = torsoXfo
    this.dropAvatar.addChild(torosGeomItem, false)

    const floorGeomItem = new GeomItem('floor', new Circle(0.3, 32), lineMaterial)
    floorGeomItem.setSelectable(false)
    // const torsoXfo = new Xfo()
    // torsoXfo.tr.set(0, 0, 1.1)
    // floorGeomItem.localXfoParam.value = torsoXfo
    this.dropAvatar.addChild(floorGeomItem, false)

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

    this.dropAvatar.setVisible(false)
    this.appData.scene.getRoot().addChild(this.dropAvatar, false)
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

    this.appData.scene.getRoot().removeChildByHandle(this.dropAvatar)
  }

  private setPointerLength(length: number, controller: XRController): void {
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
        const pointerRay = controller.pointerRay
        if (intersectionData) {
          this.setPointerLength(intersectionData.dist, controller)

          const avatarXfo = new Xfo()
          avatarXfo.tr = pointerRay.pointAtDist(intersectionData.dist)
          this.dropAvatar.localXfoParam.value = avatarXfo
          this.dropAvatar.setVisible(true)
        } else {
          const dist = pointerRay.intersectRayPlane(this.floorPlane)
          if (Number.isFinite(dist) && dist > 0) {
            this.setPointerLength(dist, controller)

            const avatarXfo = new Xfo()
            avatarXfo.tr = pointerRay.pointAtDist(dist)
            this.dropAvatar.localXfoParam.value = avatarXfo
            this.dropAvatar.setVisible(true)
          } else {
            this.setPointerLength(this.raycastDist, controller)
            this.dropAvatar.setVisible(false)
          }
        }
      })
      event.stopPropagation()
    }
  }

  /**
   * Event fired when a pointing device button is clicked.
   *
   * @param event - The event param.
   */
  onPointerClick(event: ZeaPointerEvent) {
    if (event instanceof ZeaMouseEvent && event.button == 0) {
      const ray = event.pointerRay
      const dist = ray.intersectRayPlane(new Ray(new Vec3(), new Vec3(0, 0, 1)))
      const groundPoint = ray.pointAtDist(dist)
      const camera = this.appData.renderer.getViewport().getCamera()

      const pointerDir = ray.dir.negate()
      pointerDir.z = 0
      pointerDir.normalizeInPlace()
      const ori = new Quat()
      ori.setFromDirectionAndUpvector(pointerDir, new Vec3(0, 0, 1))

      const cameraXfo = camera.globalXfoParam.value.clone()
      const cameraDir = cameraXfo.ori.getZaxis()
      cameraDir.z = 0
      cameraDir.normalizeInPlace()
      cameraXfo.ori.setFromDirectionAndUpvector(cameraDir, new Vec3(0, 0, 1))

      const deltaOri = ori.multiply(cameraXfo.ori.inverse())

      const xfo = camera.globalXfoParam.value.clone()
      xfo.tr = groundPoint
      xfo.tr.z += 1.7
      xfo.ori = deltaOri.multiply(xfo.ori)
      camera.globalXfoParam.value = xfo
      camera.focalDistanceParam.value = 1.7
    } else if (event instanceof XRControllerEvent && event.button == 0) {
      const xrController = event.controller

      if (this.vrViewport) {
        const headXfo = this.vrViewport.getVRHead().getTreeItem().globalXfoParam.value
        const headLocalXfo = this.vrViewport.getVRHead().getXfo()
        const avatarXfo = this.dropAvatar.globalXfoParam.value
        avatarXfo.tr.z += 1.7
        const stageXfo = this.vrViewport.getXfo()

        // reset the stage scale.
        stageXfo.sc.set(1, 1, 1)

        // Calculate the translation to apply to the stage to maintain the current
        // head position after the scale reset.
        const newHeadXfo = stageXfo.multiply(headLocalXfo)
        const delta = headXfo.tr.subtract(newHeadXfo.tr)
        stageXfo.tr.addInPlace(delta)

        // apply the delte beteen the head postion and the controller position to the stage.
        const deltaTr = avatarXfo.tr.subtract(headXfo.tr)
        stageXfo.tr.addInPlace(deltaTr)

        this.vrViewport.setXfo(stageXfo)

        const viewManipulator = this.toolManager.tools['XRViewManipulator'] as XRViewManipulator
        if (viewManipulator) {
          viewManipulator.enableViewScale = false
        }

        if (this.toolManager) {
          this.toolManager.removeTool(this)
          console.log(this.toolManager.toolStack)
        }
      }
    }
  }

  /**
   * Event fired when a pointing device button is double clicked.
   *
   * @param event - The event param.
   */
  onPointerDoubleClick(event: ZeaPointerEvent) {
    if (this.vrViewport) {
      const box3 = this.appData.scene.getRoot().boundingBoxParam.value
      if (!box3.isValid()) {
        console.warn('Bounding box not valid.')
        return
      }
      // Compute the distance the camera should be to fit the entire bounding sphere
      const focalDistance = box3.size()

      const headXfo = this.vrViewport.getVRHead().getTreeItem().globalXfoParam.value
      const cameraViewVec = headXfo.ori.getZaxis()
      const targetOffset = cameraViewVec.scale(-focalDistance)
      const newTarget = box3.center()

      const stageXfo = this.vrViewport.getXfo()
      stageXfo.sc.set(focalDistance, focalDistance, focalDistance)
      stageXfo.tr = newTarget.subtract(targetOffset)
      this.vrViewport.setXfo(stageXfo)
    }
  }
}

export { DropUserTool }
