import {
  Vec3,
  Color,
  Xfo,
  Ray,
  GeomItem,
  Material,
  Lines,
} from '@zeainc/zea-engine'
import BaseTool from '../BaseTool.js'
import VRControllerUI from './VRControllerUI.js'

/**
 * Class representing a VR UI tool.
 * @extends BaseTool
 */
class VRUITool extends BaseTool {
  /**
   * Create a VR UI tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super(appData)

    this.__vrUIDOMHolderElement = document.createElement('div')
    this.__vrUIDOMHolderElement.className = 'vrUIHolder'
    this.__vrUIDOMElement = document.createElement('div')
    this.__vrUIDOMElement.className = 'vrUI'
    document.body.appendChild(this.__vrUIDOMHolderElement)

    this.controllerUI = new VRControllerUI(
      appData,
      this.__vrUIDOMHolderElement,
      this.__vrUIDOMElement
    )
    this.controllerUI.addRef(this)

    appData.renderer.addTreeItem(this.controllerUI)

    this.__uiLocalXfo = new Xfo()
    this.__uiLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.6)

    const pointermat = new Material('pointermat', 'LinesShader')
    pointermat.visibleInGeomDataBuffer = false
    pointermat.getParameter('Color').setValue(new Color(1.2, 0, 0))

    const line = new Lines()
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegment(0, 0, 1)
    line.getVertex(0).set(0.0, 0.0, 0.0)
    line.getVertex(1).set(0.0, 0.0, -1.0)
    line.setBoundingBoxDirty()
    this.__pointerLocalXfo = new Xfo()
    this.__pointerLocalXfo.sc.set(1, 1, 0.1)
    this.__pointerLocalXfo.ori.setFromAxisAndAngle(
      new Vec3(1, 0, 0),
      Math.PI * -0.2
    )

    this.__uiPointerItem = new GeomItem('VRControllerPointer', line, pointermat)
    this.__uiPointerItem.addRef(this)

    this.__triggerHeld = false
  }

  /**
   * The getName method.
   * @return {any} The return value.
   */
  getName() {
    return 'VRUITool'
  }

  // ///////////////////////////////////

  /**
   * The setUIControllers method.
   * @param {any} openUITool - The openUITool param.
   * @param {any} uiController - The uiController param.
   * @param {any} pointerController - The pointerController param.
   * @param {any} headXfo - The headXfo param.
   */
  setUIControllers(openUITool, uiController, pointerController, headXfo) {
    this.openUITool = openUITool
    this.uiController = uiController
    this.pointerController = pointerController

    const xfoA = this.uiController
      .getTreeItem()
      .getParameter('GlobalXfo')
      .getValue()
    if (this.pointerController) {
      const xfoB = this.pointerController
        .getTreeItem()
        .getParameter('GlobalXfo')
        .getValue()
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
      const headToCtrlB = xfoB.tr.subtract(headXfo.tr)
      if (headToCtrlA.cross(headToCtrlB).dot(headXfo.ori.getYaxis()) > 0.0) {
        this.__uiLocalXfo.tr.set(0.05, -0.05, 0.08)
      } else {
        this.__uiLocalXfo.tr.set(-0.05, -0.05, 0.08)
      }
    } else {
      this.__uiLocalXfo.tr.set(0, -0.05, 0.08)
    }

    this.controllerUI.getParameter('LocalXfo').setValue(this.__uiLocalXfo)
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()

    this.controllerUI.activate()

    if (this.uiController) {
      this.uiController.getTipItem().addChild(this.controllerUI, false)
      if (this.pointerController)
        this.pointerController
          .getTipItem()
          .addChild(this.__uiPointerItem, false)

      this.appData.session.pub('pose-message', {
        interfaceType: 'VR',
        showUIPanel: {
          controllerId: this.uiController.getId(),
          localXfo: this.__uiLocalXfo.toJSON(),
          size: this.controllerUI.getGeomOffsetXfo().sc.toJSON(),
        },
      })
    }
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    super.deactivateTool()

    this.controllerUI.deactivate()

    if (this.uiController) {
      this.uiController.getTipItem().removeChildByHandle(this.controllerUI)
      if (this.pointerController) {
        this.pointerController
          .getTipItem()
          .removeChildByHandle(this.__uiPointerItem)
      }

      this.appData.session.pub('pose-message', {
        interfaceType: 'VR',
        hideUIPanel: {
          controllerId: this.uiController.getId(),
        },
      })
    }
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The setPointerLength method.
   * @param {any} length - The length param.
   */
  setPointerLength(length) {
    this.__pointerLocalXfo.sc.set(1, 1, length)
    this.__uiPointerItem
      .getParameter('LocalXfo')
      .setValue(this.__pointerLocalXfo)
  }

  /**
   * The calcUIIntersection method.
   * @return {any} The return value.
   */
  calcUIIntersection() {
    const pointerXfo = this.__uiPointerItem.getParameter('GlobalXfo').getValue()
    const pointervec = pointerXfo.ori.getZaxis().negate()
    const ray = new Ray(pointerXfo.tr, pointervec)

    const planeXfo = this.controllerUI.getParameter('GlobalXfo').getValue()
    const planeSize = this.controllerUI.getGeomOffsetXfo().sc
    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate())
    const res = ray.intersectRayPlane(plane)
    if (res <= 0) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    const hitOffset = pointerXfo.tr
      .add(pointervec.scale(res))
      .subtract(plane.start)
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeSize.x
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeSize.y
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    this.setPointerLength(res)
    const rect = this.__vrUIDOMElement.getBoundingClientRect()
    return {
      clientX: Math.round(x * rect.width + rect.width / 2),
      clientY: Math.round(y * -rect.height + rect.height / 2),
    }
  }

  /**
   * The sendEventToUI method.
   * @param {any} eventName - The eventName param.
   * @param {any} args - The args param.
   * @return {any} The return value.
   */
  sendEventToUI(eventName, args) {
    const hit = this.calcUIIntersection()
    if (hit) {
      hit.offsetX = hit.pageX = hit.pageX = hit.screenX = hit.clientX
      hit.offsetY = hit.pageY = hit.pageY = hit.screenY = hit.clientY
      const element = document.elementFromPoint(hit.clientX, hit.clientY)
      if (element != this._element) {
        if (this._element)
          this.controllerUI.sendMouseEvent(
            'mouseleave',
            Object.assign(args, hit),
            this._element
          )
        this._element = element
        this.controllerUI.sendMouseEvent(
          'mouseenter',
          Object.assign(args, hit),
          this._element
        )
      }
      this.controllerUI.sendMouseEvent(
        eventName,
        Object.assign(args, hit),
        this._element
      )
      return this._element
    } else if (this._element) {
      this.controllerUI.sendMouseEvent(
        'mouseleave',
        Object.assign(args, hit),
        this._element
      )
      this._element = null
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    if (event.controller == this.pointerController) {
      this.__triggerHeld = true
      const target = this.sendEventToUI('mousedown', {
        button: event.button - 1,
      })
      if (target) {
        this.__triggerDownElem = target
      } else {
        this.__triggerDownElem = null
      }
    }

    // While the UI is open, no other tools get events.
    return true
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (event.controller == this.pointerController) {
      this.__triggerHeld = false
      const target = this.sendEventToUI('mouseup', {
        button: event.button - 1,
      })
      if (target && this.__triggerDownElem == target) {
        this.sendEventToUI('click', {
          button: event.button - 1,
        })
      }
      this.__triggerDownElem = null
    }

    // While the UI is open, no other tools get events.
    return true
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo
    const checkControllers = () => {
      const xfoA = this.uiController
        .getTreeItem()
        .getParameter('GlobalXfo')
        .getValue()
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
      headToCtrlA.normalizeInPlace()
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > Math.PI * 0.5) {
        // Remove ourself from the system.
        this.appData.toolManager.removeToolByHandle(this)
        return false
      }
      return true
    }

    // if (!this.__triggerHeld) {
    //   if(checkControllers()){
    //     this.calcUIIntersection();
    //   }
    // } else {
    if (checkControllers()) {
      this.sendEventToUI('mousemove', {})
    }

    // While the UI is open, no other tools get events.
    return true
  }
}

export { VRUITool }
