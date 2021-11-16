import { Vec3, Color, Xfo, Ray, GeomItem, Material, Lines, BaseTool, POINTER_TYPES } from '@zeainc/zea-engine'
import VRControllerUI from './VRControllerUI'

/**
 * Class representing a VR UI tool.
 *
 * @extends BaseTool
 */
class VRUITool extends BaseTool {
  /**
   * Create a VR UI tool.
   * @param {object} appData - The appData value.
   * @param {HTMLElement} vrUIDOMElement - The  dom element we will use as the VR UI
   */
  constructor(appData, vrUIDOMElement) {
    super(appData)
    this.appData = appData

    this.__vrUIDOMElement = vrUIDOMElement
    this.controllerUI = new VRControllerUI(appData, this.__vrUIDOMElement)

    // To debug the UI in the renderer without being in VR, enable this line.
    // appData.renderer.addTreeItem(this.controllerUI)

    const pointermat = new Material('pointermat', 'LinesShader')
    pointermat.setSelectable(false)
    pointermat.getParameter('BaseColor').setValue(new Color(1.2, 0, 0))

    const line = new Lines()
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    const positions = line.getVertexAttribute('positions')
    positions.getValueRef(0).set(0.0, 0.0, 0.0)
    positions.getValueRef(1).set(0.0, 0.0, -1.0)
    line.setBoundingBoxDirty()
    this.__pointerLocalXfo = new Xfo()
    this.__pointerLocalXfo.sc.set(1, 1, 0.1)
    this.__pointerLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.2)

    this.__uiPointerItem = new GeomItem('VRControllerPointer', line, pointermat)
    this.__uiPointerItem.setSelectable(false)

    this.__triggerHeld = false
    this.uiOpen = false

    this.appData.renderer.getXRViewport().then((xrvp) => {
      xrvp.on('presentingChanged', (event) => {
        if (this.uiOpen && !event.state) this.closeUI()
      })
    })
  }

  /**
   * The getName method.
   *
   * @return {string} The return value.
   */
  getName() {
    return 'VRUITool'
  }

  // ///////////////////////////////////
  /**
   * The activateTool method.
   */
  activateTool() {
    super.activateTool()
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    if (this.uiOpen) this.closeUI()
    super.deactivateTool()
  }

  /**
   * The displayUI method.
   * @param {VRController} uiController - The uiController param.
   * @param {VRController} pointerController - The pointerController param.
   * @param {Xfo} headXfo - The headXfo param.
   */
  displayUI(uiController, pointerController, headXfo) {
    this.controllerUI.activate()
    this.uiController = uiController
    this.pointerController = pointerController

    const uiLocalXfo = this.controllerUI.getParameter('LocalXfo').getValue()
    uiLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.6)
    // uiLocalXfo.tr.set(0, -0.05, 0.08)

    if (this.pointerController) {
      const xfoA = this.uiController.getTreeItem().getParameter('GlobalXfo').getValue()
      const xfoB = this.pointerController.getTreeItem().getParameter('GlobalXfo').getValue()
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
      const headToCtrlB = xfoB.tr.subtract(headXfo.tr)
      if (headToCtrlA.cross(headToCtrlB).dot(headXfo.ori.getYaxis()) > 0.0) {
        uiLocalXfo.tr.set(0.05, -0.05, 0.08)
      } else {
        uiLocalXfo.tr.set(-0.05, -0.05, 0.08)
      }
    } else {
      uiLocalXfo.tr.set(0, -0.05, 0.08)
    }

    this.controllerUI.getParameter('LocalXfo').setValue(uiLocalXfo)

    if (this.uiController) {
      this.uiController.getTipItem().addChild(this.controllerUI, false)
      if (this.pointerController) this.pointerController.getTipItem().addChild(this.__uiPointerItem, false)

      if (this.appData.session) {
        const postMessage = () => {
          this.appData.session.pub('pose-message', {
            interfaceType: 'VR',
            showUIPanel: {
              controllerId: this.uiController.getId(),
              localXfo: uiLocalXfo.toJSON(),
              size: this.controllerUI.size.toJSON(),
            },
          })
        }
        if (!this.controllerUI.ready) {
          this.controllerUI.on('ready', postMessage)
        } else {
          postMessage()
        }
      }
    }
    this.uiOpen = true
  }

  /**
   * The closeUI method.
   */
  closeUI() {
    this.controllerUI.deactivate()

    if (this.uiController) {
      this.uiController.getTipItem().removeChildByHandle(this.controllerUI)
      if (this.pointerController) {
        this.pointerController.getTipItem().removeChildByHandle(this.__uiPointerItem)
      }

      if (this.appData.session) {
        this.appData.session.pub('pose-message', {
          interfaceType: 'VR',
          closehideUIPanel: {
            controllerId: this.uiController.getId(),
          },
        })
      }
    }
    this.uiOpen = false
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The setPointerLength method.
   * @param {number} length - The length param.
   */
  setPointerLength(length) {
    this.__pointerLocalXfo.sc.set(1, 1, length)
    this.__uiPointerItem.getParameter('LocalXfo').setValue(this.__pointerLocalXfo)
  }

  /**
   * The calcUIIntersection method.
   *
   * @return {object|undefined} The return value.
   */
  calcUIIntersection() {
    const pointerXfo = this.__uiPointerItem.getParameter('GlobalXfo').getValue()
    const pointerVec = pointerXfo.ori.getZaxis().negate()
    const ray = new Ray(pointerXfo.tr, pointerVec)

    const planeXfo = this.controllerUI.getParameter('GlobalXfo').getValue()
    const planeSize = this.controllerUI.size.multiply(planeXfo.sc)

    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate())
    const res = ray.intersectRayPlane(plane)
    if (res <= 0) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    const hitOffset = pointerXfo.tr.add(pointerVec.scale(res)).subtract(plane.start)
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeSize.x
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeSize.y
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    this.setPointerLength(res / planeXfo.sc.z)
    const rect = this.__vrUIDOMElement.getBoundingClientRect()
    return {
      clientX: Math.round(x * -rect.width + rect.width / 2),
      clientY: Math.round(y * -rect.height + rect.height / 2),
    }
  }

  /**
   * The sendEventToUI method.
   * @param {string} eventName - The eventName param.
   * @param {any} args - The args param.
   * @return {any} The return value.
   */
  sendEventToUI(eventName, args) {
    const hit = this.calcUIIntersection()
    if (hit) {
      hit.offsetX = hit.pageX = hit.pageX = hit.screenX = hit.clientX
      hit.offsetY = hit.pageY = hit.pageY = hit.screenY = hit.clientY

      let element = document.elementFromPoint(hit.clientX, hit.clientY)
      if (element) {
        if (element.shadowRoot) element = element.shadowRoot.elementFromPoint(hit.clientX, hit.clientY)
        if (element != this._element) {
          if (this._element) this.controllerUI.sendMouseEvent('mouseleave', Object.assign(args, hit), this._element)
          this._element = element
          this.controllerUI.sendMouseEvent('mouseenter', Object.assign(args, hit), this._element)
        }
        this.controllerUI.sendMouseEvent(eventName, Object.assign(args, hit), this._element)
      } else {
        this._element = null
      }
      return this._element
    } else if (this._element) {
      this.controllerUI.sendMouseEvent('mouseleave', Object.assign(args, hit), this._element)
      this._element = null
    }
  }

  /**
   * The onVRControllerButtonDown method.
   * @param {object} event - The event param.
   */
  onPointerDown(event) {
    if (event.pointerType === POINTER_TYPES.xr) {
      if (event.controller == this.pointerController && this.uiOpen) {
        this.__triggerHeld = true
        const target = this.sendEventToUI('mousedown', {
          button: event.button - 1,
        })
        if (target) {
          this.__triggerDownElem = target
        } else {
          this.__triggerDownElem = null
        }
        // While the UI is open, no other tools get events.
        event.stopPropagation()
      }
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {object} event - The event param.
   */
  onPointerUp(event) {
    if (event.pointerType === POINTER_TYPES.xr) {
      if (event.controller == this.pointerController && this.uiOpen) {
        this.__triggerHeld = false
        const target = this.sendEventToUI('mouseup', {
          button: event.button - 1,
        })
        if (target && this.__triggerDownElem == target) {
          this.sendEventToUI('mouseup', {
            button: event.button - 1,
          })
        }
        this.__triggerDownElem = null
        // While the UI is open, no other tools get events.
        event.stopPropagation()
      }
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {object} event - The event param.
   */
  onPointerMove(event) {
    if (event.pointerType === POINTER_TYPES.xr) {
      if (!this.uiOpen) {
        if (
          !event.controllers[0] ||
          event.controllers[0].buttonPressed ||
          !event.controllers[1] ||
          event.controllers[1].buttonPressed
        ) {
          return
        }
        // Controller coordinate system
        // X = Horizontal.
        // Y = Up.
        // Z = Towards handle base.
        const headXfo = event.viewXfo
        const checkControllers = (ctrlA, ctrlB) => {
          // Note: do not open the UI when the controller buttons are pressed.
          const xfoA = ctrlA.getTreeItem().getParameter('GlobalXfo').getValue()
          const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
          headToCtrlA.normalizeInPlace()
          if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) < Math.PI * 0.25) {
            this.displayUI(ctrlA, ctrlB, headXfo)
            event.setCapture(this)
            event.stopPropagation()
            return true
          }
          return false
        }

        if (checkControllers(event.controllers[0], event.controllers[1])) return
        if (checkControllers(event.controllers[1], event.controllers[0])) return
      } else {
        // Controller coordinate system
        // X = Horizontal.
        // Y = Up.
        // Z = Towards handle base.
        const headXfo = event.viewXfo
        const checkControllers = () => {
          const xfoA = this.uiController.getTreeItem().getParameter('GlobalXfo').getValue()
          const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
          headToCtrlA.normalizeInPlace()
          if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > Math.PI * 0.5) {
            // Remove ourself from the system.
            this.closeUI()
            if (event.getCapture() == this) {
              event.releaseCapture(this)
            }
            return false
          }
          return true
        }

        if (checkControllers()) {
          this.sendEventToUI('mousemove', {})
        }
        // While the UI is open, no other tools get events.
        event.stopPropagation()
      }
    }
  }
}

export default VRUITool
export { VRUITool }
