import {
  BaseTool,
  Quat,
  Ray,
  VRViewport,
  Vec3,
  XRControllerEvent,
  XRViewManipulator,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../../types/types'
import { ToolManager } from '../ToolManager'

class DropUserTool extends BaseTool {
  private appData: AppData
  private toolManager: ToolManager

  private vrViewport: VRViewport
  private prevCursor: string

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
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
    super.deactivateTool()
    if (this.appData && this.appData.renderer) {
      this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor
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
        const tipXfo = xrController.getTipItem().globalXfoParam.value
        const stageXfo = this.vrViewport.getXfo()

        // reset the stage scale.
        stageXfo.sc.set(1, 1, 1)

        // Calculate the translation to apply to the stage to maintain the current
        // head position after the scale reset.
        const newHeadXfo = stageXfo.multiply(headLocalXfo)
        const delta = headXfo.tr.subtract(newHeadXfo.tr)
        stageXfo.tr.addInPlace(delta)

        // apply the delte beteen the head postion and the controller position to the stage.
        const deltaTr = tipXfo.tr.subtract(headXfo.tr)
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
