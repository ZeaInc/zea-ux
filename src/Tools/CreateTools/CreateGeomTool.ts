import {
  Color,
  Xfo,
  Ray,
  ColorParameter,
  GeomItem,
  Material,
  Cross,
  TreeItem,
  Vec3,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  BaseGeom,
  GLViewport,
  ZeaKeyboardEvent,
  XRController,
  XRControllerEvent,
  Quat,
  XRPoseEvent,
} from '@zeainc/zea-engine'
import BaseCreateTool from '../BaseCreateTool'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'

const snapPlanNormal = (dir: Vec3): Vec3 => {
  const x = Math.abs(dir.x)
  const y = Math.abs(dir.y)
  const z = Math.abs(dir.z)
  if (x > y && x > z) {
    const result = dir.clone()
    result.y = 0
    result.z = 0
    return result.normalize()
  } else if (y > x && y > z) {
    const result = dir.clone()
    result.x = 0
    result.z = 0
    return result.normalize()
  } else if (z > x && z > y) {
    const result = dir.clone()
    result.x = 0
    result.y = 0
    return result.normalize()
  }
  return dir
}

/**
 * Base class for creating geometry tools.
 *
 * @extends BaseCreateTool
 */
class CreateGeomTool extends BaseCreateTool {
  stage: number
  removeToolOnRightClick: boolean
  parentItem: TreeItem
  colorParam = new ColorParameter('Color', new Color(0.7, 0.2, 0.2))
  vrControllerToolTipMat: Material
  vrControllerToolTip: BaseGeom | Cross
  prevCursor: string
  constructionPlane: Xfo
  private activeController: XRController
  /**
   * Create a create geom tool.
   *
   * @param appData - The appData value.
   */
  constructor(appData: AppData) {
    super(appData)

    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.stage = 0
    this.removeToolOnRightClick = true
    this.parentItem = 'parentItem' in appData ? appData.parentItem : appData.scene.getRoot()

    this.addParameter(this.colorParam)

    this.controllerAddedHandler = this.controllerAddedHandler.bind(this)
  }

  /**
   * Adds a geometry icon to the VR Controller
   * @param controller - The controller object.
   */
  addIconToVRController(controller: XRController): void {
    if (!this.vrControllerToolTip) {
      this.vrControllerToolTip = new Cross(0.05)
      this.vrControllerToolTipMat = new Material('VRController Cross', 'LinesShader')
      this.vrControllerToolTipMat.getParameter('BaseColor').value = this.colorParam.value
      this.vrControllerToolTipMat.setSelectable(false)
    }
    const geomItem = new GeomItem('CreateGeomToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat)
    geomItem.setSelectable(false)
    // controller.getTipItem().removeAllChildren()
    controller.getTipItem().addChild(geomItem, false)
  }

  controllerAddedHandler(event: { controller: any }): void {
    this.addIconToVRController(event.controller)
  }

  /**
   * The activateTool method.
   */
  activateTool(): void {
    super.activateTool()

    this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
    this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'

    this.appData.renderer.getXRViewport().then((xrvp) => {
      //@ts-ignore :  TODO: Remove this after the next release of the engine.
      for (const controller of xrvp.getControllers()) {
        this.addIconToVRController(controller)
      }
      xrvp.on('controllerAdded', this.controllerAddedHandler)
    })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
    super.deactivateTool()

    this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.off('controllerAdded', this.controllerAddedHandler)
    })
  }

  private setupConstructionPlane(event: ZeaPointerEvent, snapToSurfaceUnderPointer = false) {
    const pointerRay = event.pointerRay

    const viewport = event.viewport as GLViewport
    const camera = viewport.getCamera()
    this.constructionPlane = camera.globalXfoParam.value.clone()
    this.constructionPlane.tr = pointerRay.pointAtDist(camera.getFocalDistance())

    // this code align the construction plane with the current view direction
    // It tries to orthogonalize the view directionto get a perfect orthogonal plane.
    const normal = snapPlanNormal(pointerRay.dir.negate())
    if (Math.abs(this.constructionPlane.ori.getZaxis().dot(normal)) < 1) {
      const quat = new Quat()
      quat.setFrom2Vectors(this.constructionPlane.ori.getZaxis(), normal)
      quat.normalizeInPlace()
      this.constructionPlane.ori = quat.multiply(this.constructionPlane.ori)
    }

    if (snapToSurfaceUnderPointer && event.intersectionData) {
      this.constructionPlane.tr = pointerRay.pointAtDist(event.intersectionData.dist)
    }
  }

  /**
   * Transforms the screen position in the viewport to an Xfo object.
   *
   * @param event - The event param
   * @return {Xfo} The return value.
   */
  screenPosToXfo(event: ZeaMouseEvent | ZeaTouchEvent, snapToSurfaceUnderPointer = false): Xfo {
    const ray = event.pointerRay

    if (snapToSurfaceUnderPointer && event.intersectionData) {
      const xfo = this.constructionPlane.clone()
      xfo.tr = ray.pointAtDist(event.intersectionData.dist)
      return xfo
    }

    const planeRay = new Ray(this.constructionPlane.tr, this.constructionPlane.ori.getZaxis())
    const dist = ray.intersectRayPlane(planeRay)
    if (dist > 0.0) {
      const xfo = this.constructionPlane.clone()
      xfo.tr = ray.pointAtDist(dist)
      return xfo
    }

    const viewport = event.viewport as GLViewport
    const camera = viewport.getCamera()
    const xfo = camera.globalXfoParam.value.clone()
    xfo.tr = ray.pointAtDist(camera.getFocalDistance())
    return xfo
  }

  /**
   * Starts the creation of the geometry.
   *
   * @param xfo - The xfo param.
   */
  protected createStart(xfo: Xfo, event: ZeaPointerEvent): void {
    this.stage = 1
  }

  /**
   * The createPoint method.
   *
   * @param pt - The pt param.
   */
  protected createPoint(pt: Vec3, event?: ZeaPointerEvent): void {
    // console.warn('Implement me')
  }

  /**
   * The createMove method.
   *
   * @param pt - The pt param.
   */
  protected createMove(pt: Vec3, event: ZeaPointerEvent): void {
    // console.warn('Implement me')
  }

  /**
   * The createRelease method.
   *
   * @param pt - The pt param.
   */
  protected createRelease(pt: Vec3, event: ZeaPointerEvent): void {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device button is pressed over the viewport while the tool is activated.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
      // skip if the alt key is held. Allows the camera tool to work
      if (event.altKey) return
      if (this.stage == 0) {
        if ((event instanceof ZeaMouseEvent && event.button == 0) || event instanceof ZeaTouchEvent) {
          const snapToSurfaceUnderPointer = true
          this.setupConstructionPlane(event, snapToSurfaceUnderPointer)

          this.createStart(this.constructionPlane, event)
          event.stopPropagation()
        } else if (event.button == 2) {
          // Cancel the tool.
          // if (this.removeToolOnRightClick) this.appData.toolManager.removeTool(this.index)
        }
      } else if (event instanceof ZeaMouseEvent && event.button == 2) {
        // Cancel the draw action.
        UndoRedoManager.getInstance().cancel()
        this.stage = 0
      }
      event.stopPropagation()
      //@ts-ignore
      event.preventDefault() // prevent browser features like scroll and drag n drop
    } else if (event instanceof XRControllerEvent) {
      this.onVRControllerButtonDown(event)
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event instanceof XRPoseEvent) {
      this.onXRPoseChanged(event)
    } else if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
      if (this.stage > 0) {
        const snapToSurfaceUnderPointer = false
        const xfo = this.screenPosToXfo(event, snapToSurfaceUnderPointer)
        this.createMove(xfo.tr, event)
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent && event.altKey) return
    if (event instanceof XRControllerEvent) {
      this.onVRControllerButtonUp(event)
    } else if (event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) {
      if (this.stage > 0) {
        const snapToSurfaceUnderPointer = false
        const xfo = this.screenPosToXfo(event, snapToSurfaceUnderPointer)
        this.createRelease(xfo.tr, event)
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when the user rotates the pointing device wheel, while the tool is activated.
   *
   * @param event - The event param.
   */
  onWheel(event: ZeaPointerEvent): void {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * Event fired when the user presses a key on the keyboard, while the tool is activated.
   *
   * @param event - The event param.
   */
  onKeyPressed(event: ZeaKeyboardEvent): void {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user presses down a key on the keyboard, while the tool is activated.
   *
   * @param event - The event param.
   */
  onKeyDown(event: ZeaKeyboardEvent): void {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyUp(event: ZeaKeyboardEvent): void {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////

  /**
   * Event fired when one or more touch points have been disrupted in an implementation-specific manner inside the viewport, when the tool is activated.
   *
   * @param event - The event param.
   */
  onTouchCancel(event: ZeaPointerEvent): void {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed inside the viewport, when the tool is activated.
   *
   * @param event - The event param.
   */
  onVRControllerButtonDown(event: XRControllerEvent): void {
    if (!this.activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.activeController = event.controller
      this.constructionPlane = new Xfo()
      const xfo = this.constructionPlane.clone()
      xfo.tr = this.activeController.getTipXfo().tr
      this.createStart(xfo, event)
    }
    event.stopPropagation()
  }

  /**
   * The onXRPoseChanged method.
   *
   * @param event - The event param.
   */
  onXRPoseChanged(event: XRPoseEvent): void {
    if (this.activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.activeController.getTipXfo()
      this.createMove(xfo.tr, event)
      event.stopPropagation()
    }
  }

  /**
   * Event fired when a VR controller button is released inside the viewport, when the tool is activated.
   *
   * @param event - The event param.
   */
  onVRControllerButtonUp(event: XRControllerEvent): void {
    if (this.stage > 0) {
      if (this.activeController == event.controller) {
        const xfo = this.activeController.getTipXfo()
        this.createRelease(xfo.tr, event)
        if (this.stage == 0) this.activeController = undefined
        event.stopPropagation()
      }
    }
  }
}

export default CreateGeomTool
export { CreateGeomTool }
