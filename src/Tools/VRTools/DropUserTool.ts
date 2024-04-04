import {
  BaseTool,
  Quat,
  Ray,
  VRViewport,
  Vec3,
  XRController,
  XRControllerEvent,
  Xfo,
  ZeaMouseEvent,
  ZeaPointerEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../../types/types'

class DropUserTool extends BaseTool {
  appData: AppData
  toolController: XRController
  vrViewport: VRViewport
  private prevCursor: string

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
    if (event instanceof ZeaMouseEvent) {
      if (event.button == 0) {
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
      } else if (event.button == 2) {
        const box3 = this.appData.scene.getRoot().boundingBoxParam.value
        if (!box3.isValid()) {
          console.warn('Bounding box not valid.')
          return
        }
        // Compute the distance the camera should be to fit the entire bounding sphere
        const focalDistance = box3.size()

        const camera = this.appData.renderer.getViewport().getCamera()
        const cameraXfo = camera.globalXfoParam.value.clone()
        const cameraViewVec = cameraXfo.ori.getZaxis()
        const targetOffset = cameraViewVec.scale(-focalDistance)
        const newTarget = box3.center()

        const stageXfo = camera.globalXfoParam.value.clone()
        // stageXfo.sc.set(focalDistance, focalDistance, focalDistance)
        stageXfo.tr = newTarget.subtract(targetOffset)
        camera.globalXfoParam.value = stageXfo
        camera.focalDistanceParam.value = focalDistance
      }
    } else if (event instanceof XRControllerEvent) {
      const xrController = event.controller

      if (this.vrViewport) {
        const headXfo = this.vrViewport.getVRHead().getTreeItem().globalXfoParam.value
        const headDir = headXfo.ori.getZaxis()
        headDir.z = 0
        headDir.normalizeInPlace()
        headXfo.ori.setFromDirectionAndUpvector(headDir, new Vec3(0, 0, 1))

        const stageXfo = this.vrViewport.getXfo()
        stageXfo.sc.set(1, 1, 1)

        const tipXfo = xrController.getTipItem().globalXfoParam.value.clone()

        const controllerDir = tipXfo.ori.getZaxis()
        controllerDir.z = 0
        controllerDir.normalizeInPlace()
        tipXfo.ori.setFromDirectionAndUpvector(controllerDir, new Vec3(0, 0, 1))

        const deltaTr = tipXfo.tr.subtract(stageXfo.tr)
        // Now cast a ray straight down to the ground
        // const ray = new Ray()
        // ray.start = tipXfo.tr
        // ray.dir.set(0, 0, -1)
        // const dist = 20 * stageScale
        // const area = 0.5
        // const rayXfo = new Xfo()
        // rayXfo.setLookAt(ray.start, ray.start.add(ray.dir), new Vec3(0, 0, 1))

        // const result = this.appData.renderer.raycast(rayXfo, ray, dist, area)
        // if (result) {
        //   const worldPos = ray.pointAtDist(result.dist)
        //   deltaTr.z += worldPos.z - tipXfo.tr.z
        // }

        const deltaOri = tipXfo.ori.multiply(headXfo.ori.inverse())

        stageXfo.ori = deltaOri.multiply(stageXfo.ori)
        stageXfo.tr.addInPlace(deltaTr)

        this.vrViewport.setXfo(stageXfo)
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
