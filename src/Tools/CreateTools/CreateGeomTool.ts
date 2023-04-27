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
  KeyboardEvent,
  XRController,
  XRControllerEvent,
} from '@zeainc/zea-engine'
import BaseCreateTool from '../BaseCreateTool'
import { UndoRedoManager } from '../../UndoRedo/index'
import { AppData } from '../../../types/types'

import { getPointerRay } from '../../utility'

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
  __activeController: any
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
      this.vrControllerToolTipMat.getParameter('BaseColor').value = this.colorParam.getValue()
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

  /**
   * Transforms the screen position in the viewport to an Xfo object.
   *
   * @param event - The event param
   * @return {Xfo} The return value.
   */
  screenPosToXfo(event: ZeaPointerEvent): Xfo {
    if (!(event instanceof ZeaMouseEvent) && !(event instanceof ZeaTouchEvent)) {
      console.warn('not handling VR')
      return
    }
    if (event.intersectionData) {
      const ray = getPointerRay(event)
      const xfo = this.constructionPlane.clone()
      xfo.tr = ray.pointAtDist(event.intersectionData.dist)
      return xfo
    }

    const ray = getPointerRay(event)
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
    // skip if the alt key is held. Allows the camera tool to work
    if (event instanceof XRControllerEvent) {
      this.onVRControllerButtonDown(event)
    } else if (event instanceof ZeaMouseEvent) {
      if (event.altKey) return
      if (this.stage == 0) {
        if (event.button == 0 || event.pointerType !== 'mouse') {
          this.constructionPlane = new Xfo()

          const xfo = this.screenPosToXfo(event)
          this.createStart(xfo, event)
          event.stopPropagation()
        } else if (event.button == 2) {
          // Cancel the tool.
          // if (this.removeToolOnRightClick) this.appData.toolManager.removeTool(this.index)
        }
      } else if (event.button == 2) {
        // Cancel the draw action.
        UndoRedoManager.getInstance().cancel()
        this.stage = 0
      }
      event.stopPropagation()
      //@ts-ignore
      event.preventDefault() // prevent browser features like scroll and drag n drop
    } else {
      console.warn('Touch event not handled')
    }
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent): void {
    if (event.pointerType === 'xr') {
      this.onVRPoseChanged(event as XRControllerEvent)
    } else if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event)
      this.createMove(xfo.tr, event)
      event.stopPropagation()
      //@ts-ignore
      event.preventDefault() // prevent browser features like scroll and drag n drop
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent): void {
    if (event instanceof XRControllerEvent) {
      this.onVRControllerButtonUp(event)
    } else if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event)
      this.createRelease(xfo.tr, event)
      event.stopPropagation()
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
  onKeyPressed(event: KeyboardEvent): void {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user presses down a key on the keyboard, while the tool is activated.
   *
   * @param event - The event param.
   */
  onKeyDown(event: KeyboardEvent): void {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyUp(event: KeyboardEvent): void {
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
    if (!this.__activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.__activeController = event.controller
      this.constructionPlane = new Xfo()
      const xfo = this.constructionPlane.clone()
      xfo.tr = this.__activeController.getTipXfo().tr
      this.createStart(xfo, event)
    }
    event.stopPropagation()
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param event - The event param.
   */
  onVRPoseChanged(event: XRControllerEvent): void {
    if (this.__activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.__activeController.getTipXfo()
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
      if (this.__activeController == event.controller) {
        const xfo = this.__activeController.getTipXfo()
        this.createRelease(xfo.tr, event)
        if (this.stage == 0) this.__activeController = undefined
        event.stopPropagation()
      }
    }
  }
}

export default CreateGeomTool
export { CreateGeomTool }
