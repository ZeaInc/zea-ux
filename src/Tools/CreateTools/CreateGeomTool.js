import { Color, Xfo, Ray, ColorParameter, GeomItem, Material, Cross, Vec3 } from '@zeainc/zea-engine'
import BaseCreateTool from '../BaseCreateTool'
import { UndoRedoManager } from '../../UndoRedo/index'

/**
 * Base class for creating geometry tools.
 *
 * @extends BaseCreateTool
 */
class CreateGeomTool extends BaseCreateTool {
  /**
   * Create a create geom tool.
   *
   * @param {object} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    if (!appData) console.error('App data not provided to tool')
    this.appData = appData
    this.stage = 0
    this.removeToolOnRightClick = true
    this.parentItem = 'parentItem' in appData ? appData.parentItem : appData.scene.getRoot()

    this.lineColor = this.addParameter(new ColorParameter('LineColor', new Color(0.7, 0.2, 0.2)))
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()

    this.prevCursor = this.appData.renderer.getGLCanvas().style.cursor
    this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'

    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (!this.vrControllerToolTip) {
        this.vrControllerToolTip = new Cross(0.05)
        this.vrControllerToolTipMat = new Material('VRController Cross', 'LinesShader')
        this.vrControllerToolTipMat.getParameter('Color').setValue(this.lineColor.getValue())
        this.vrControllerToolTipMat.visibleInGeomDataBuffer = false
      }
      const addIconToController = (controller) => {
        const geomItem = new GeomItem('CreateGeomToolTip', this.vrControllerToolTip, this.vrControllerToolTipMat)
        controller.getTipItem().removeAllChildren()
        controller.getTipItem().addChild(geomItem, false)
      }
      for (const controller of xrvp.getControllers()) {
        addIconToController(controller)
      }
      this.addIconToControllerId = xrvp.on('controllerAdded', addIconToController)
    })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool()

    this.appData.renderer.getGLCanvas().style.cursor = this.prevCursor

    this.appData.renderer.getXRViewport().then((xrvp) => {
      // for(let controller of xrvp.getControllers()) {
      //   controller.getTipItem().removeAllChildren();
      // }
      xrvp.removeListenerById('controllerAdded', this.addIconToControllerId)
    })
  }

  /**
   * Transforms the screen position in the viewport to an Xfo object.
   *
   * @param {MouseEvent|TouchEvent} event - The event param
   * @return {Xfo} The return value.
   */
  screenPosToXfo(event) {
    const ray = event.pointerRay

    if (event.intersectionData) {
      const xfo = this.constructionPlane.clone()
      xfo.tr = ray.start.add(ray.dir.scale(event.intersectionData.dist))
      return xfo
    }

    const planeRay = new Ray(this.constructionPlane.tr, this.constructionPlane.ori.getZaxis())
    const dist = ray.intersectRayPlane(planeRay)
    if (dist > 0.0) {
      const xfo = this.constructionPlane.clone()
      xfo.tr = ray.pointAtDist(dist)
      return xfo
    }

    const camera = event.viewport.getCamera()
    const xfo = camera.getParameter('GlobalXfo').getValue().clone()
    xfo.tr = ray.pointAtDist(camera.getFocalDistance())
    return xfo
  }

  /**
   * Starts the creation of the geometry.
   *
   * @param {Xfo} xfo - The xfo param.
   */
  createStart(xfo) {
    this.stage = 1
  }

  /**
   * The createPoint method.
   *
   * @param {Vec3} pt - The pt param.
   */
  createPoint(pt) {
    // console.warn('Implement me')
  }

  /**
   * The createMove method.
   *
   * @param {Vec3} pt - The pt param.
   */
  createMove(pt) {
    // console.warn('Implement me')
  }

  /**
   * The createRelease method.
   *
   * @param {Vec3} pt - The pt param.
   */
  createRelease(pt) {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device button is pressed over the viewport while the tool is activated.
   *
   * @param {MouseEvent|TouchEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerDown(event) {
    // skip if the alt key is held. Allows the camera tool to work
    if (event.altKey) return

    //
    if (this.stage == 0) {
      if (event.button == 0) {
        this.constructionPlane = new Xfo()

        const xfo = this.screenPosToXfo(event)
        this.createStart(xfo)
        event.stopPropagation()
      } else if (event.button == 2) {
        // Cancel the tool.
        // if (this.removeToolOnRightClick) this.appData.toolManager.removeTool(this.index)
      }
      return true
    } else if (event.button == 2) {
      // Cancel the draw action.
      UndoRedoManager.getInstance().undo(false)
      this.stage = 0
      return true
    }
    return true
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside the viewport, while tool is activated.
   *
   * @param {MouseEvent|TouchEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerMove(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event)
      this.createMove(xfo.tr)
      return true
    }
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the viewport, while the tool is activated.
   *
   * @param {MouseEvent|TouchEvent} event - The event param.
   * @return {boolean} The return value.
   */
  onPointerUp(event) {
    if (this.stage > 0) {
      const xfo = this.screenPosToXfo(event)
      this.createRelease(xfo.tr)
      return true
    }
  }

  /**
   * Event fired when the user rotates the pointing device wheel, while the tool is activated.
   *
   * @param {MouseEvent} event - The event param.
   */
  onWheel(event) {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * Event fired when the user presses a key on the keyboard, while the tool is activated.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyPressed(event) {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user presses down a key on the keyboard, while the tool is activated.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyDown(event) {
    // console.warn('Implement me')
  }

  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyUp(event) {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////

  /**
   * Event fired when one or more touch points have been disrupted in an implementation-specific manner inside the viewport, when the tool is activated.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchCancel(event) {
    // console.warn('Implement me')
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed inside the viewport, when the tool is activated.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonDown(event) {
    if (!this.__activeController) {
      // TODO: Snap the Xfo to any nearby construction planes.
      this.__activeController = event.controller
      this.constructionPlane = new Xfo()
      const xfo = this.constructionPlane.clone()
      xfo.tr = this.__activeController.getTipXfo().tr
      this.createStart(xfo, this.appData.scene.getRoot())
    }
    return true
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRPoseChanged(event) {
    if (this.__activeController && this.stage > 0) {
      // TODO: Snap the Xfo to any nearby construction planes.
      const xfo = this.__activeController.getTipXfo()
      this.createMove(xfo.tr)
      return true
    }
  }

  /**
   * Event fired when a VR controller button is released inside the viewport, when the tool is activated.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.stage > 0) {
      if (this.__activeController == event.controller) {
        const xfo = this.__activeController.getTipXfo()
        this.createRelease(xfo.tr)
        if (this.stage == 0) this.__activeController = undefined
        return true
      }
    }
  }
}

export default CreateGeomTool
export { CreateGeomTool }
