import {
  Vec3,
  Color,
  Xfo,
  EulerAngles,
  Ray,
  GeomItem,
  Material,
  Lines,
  BaseTool,
  POINTER_TYPES,
} from '@zeainc/zea-engine'
import { DomTree } from '../../DomTree'

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
    this.uiTree = new DomTree(this.__vrUIDOMElement)

    this.uiTree.setSelectable(false)
    this.uiTree.getParameter('Visible').setValue(false)

    // To debug the UI in the renderer without being in VR, enable this line.
    // appData.renderer.addTreeItem(this.uiTree)

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
    this.uiTree.getParameter('Visible').setValue(true)
    this.uiController = uiController
    this.pointerController = pointerController

    const uiLocalXfo = this.uiTree.getParameter('LocalXfo').getValue()

    uiLocalXfo.ori.setFromEulerAngles(new EulerAngles(Math.PI, Math.PI, 0))
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

    this.uiTree.getParameter('LocalXfo').setValue(uiLocalXfo)

    if (this.uiController) {
      this.uiController.getTipItem().addChild(this.uiTree, false)
      if (this.pointerController) this.pointerController.getTipItem().addChild(this.__uiPointerItem, false)

      if (this.appData.session) {
        const postMessage = () => {
          this.appData.session.pub('pose-message', {
            interfaceType: 'VR',
            showUIPanel: {
              controllerId: this.uiController.getId(),
              localXfo: uiLocalXfo.toJSON(),
              size: this.uiTree.size.toJSON(),
            },
          })
        }
        if (!this.uiTree.ready) {
          this.uiTree.on('ready', postMessage)
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
    this.uiTree.getParameter('Visible').setValue(false)

    if (this.uiController) {
      this.uiController.getTipItem().removeChildByHandle(this.uiTree)
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
   * The sendEventToUI method.
   * @param {string} eventName - The eventName param.
   * @param {any} args - The args param.
   */
  sendEventToUI(eventName, args) {
    const pointerXfo = this.__uiPointerItem.getParameter('GlobalXfo').getValue()
    const pointerVec = pointerXfo.ori.getZaxis().negate()
    const ray = new Ray(pointerXfo.tr, pointerVec)
    const res = this.uiTree.rayIntersect(ray, eventName, args)
    if (res > 0) {
      this.setPointerLength(res)
    } else if (this._element) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
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
