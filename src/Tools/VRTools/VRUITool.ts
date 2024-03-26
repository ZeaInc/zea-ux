// TODO: need to export POINTER_TYPES
import {
  // @ts-ignore
  POINTER_TYPES,
  Vec3,
  Color,
  Xfo,
  Ray,
  GeomItem,
  Material,
  Lines,
  BaseTool,
  Vec3Attribute,
  XRController,
  XRControllerEvent,
  XRPoseEvent,
  ZeaKeyboardEvent,
  GLViewport,
  Quat,
} from '@zeainc/zea-engine'

import { AppData } from '../../../types/types'
import VRControllerUI from './VRControllerUI'

interface UIIntersection {
  clientX: number
  clientY: number
}

/**
 * Class representing a VR UI tool.
 *
 * @extends BaseTool
 */
class VRUITool extends BaseTool {
  private appData: AppData
  private vrUIDOMElement: HTMLElement
  private controllerUI: VRControllerUI
  private pointerLocalXfo: Xfo
  private uiPointerItem: GeomItem
  private uiOpen: boolean = false
  private triggerHeld: boolean = false

  private uiController: XRController
  private pointerController: any
  private element: Element
  private openUIKeyboardHotkey = ' '

  /**
   * Create a VR UI tool.
   * @param appData - The appData value.
   * @param vrUIDOMElement - The  dom element we will use as the VR UI
   */
  constructor(appData: AppData, vrUIDOMElement: HTMLElement) {
    super()
    this.appData = appData

    this.vrUIDOMElement = vrUIDOMElement
    this.controllerUI = new VRControllerUI(appData, this.vrUIDOMElement)

    const pointermat = new Material('pointermat', 'LinesShader')
    pointermat.setSelectable(false)
    pointermat.getParameter('BaseColor').value = new Color(1.2, 0, 0)

    const line = new Lines()
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    const positions = <Vec3Attribute>line.getVertexAttribute('positions')
    positions.getValueRef(0).set(0.0, 0.0, 0.0)
    positions.getValueRef(1).set(0.0, 0.0, -1.0)
    line.setBoundingBoxDirty()
    this.pointerLocalXfo = new Xfo()
    this.pointerLocalXfo.sc.set(1, 1, 0.1)
    this.pointerLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.2)

    this.uiPointerItem = new GeomItem('VRControllerPointer', line, pointermat)
    this.uiPointerItem.setSelectable(false)

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
  getName(): string {
    return 'VRUITool'
  }

  // ///////////////////////////////////
  /**
   * The activateTool method.
   */
  activateTool(): void {
    super.activateTool()
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
    if (this.uiOpen) this.closeUI()
    super.deactivateTool()
  }

  /**
   * The displayUI method.
   * @param uiController - The uiController param.
   * @param : VRController - The pointerController param.
   * @param headXfo - The headXfo param.
   */
  displayUI(uiController: XRController, pointerController: XRController, headXfo: Xfo): void {
    this.controllerUI.activate()
    this.uiController = uiController
    this.pointerController = pointerController

    const uiLocalXfo = this.controllerUI.localXfoParam.getValue()
    uiLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.6)
    // uiLocalXfo.tr.set(0, -0.05, 0.08)

    if (this.pointerController) {
      const xfoA = this.uiController.getTreeItem().globalXfoParam.value
      const xfoB = this.pointerController.getTreeItem().globalXfoParam.value
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

    this.controllerUI.localXfoParam.value = uiLocalXfo

    if (this.uiController) {
      this.uiController.getTipItem().addChild(this.controllerUI, false)
      if (this.pointerController) this.pointerController.getTipItem().addChild(this.uiPointerItem, false)

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
  closeUI(): void {
    this.controllerUI.deactivate()

    if (this.uiController) {
      this.uiController.getTipItem().removeChildByHandle(this.controllerUI)
      if (this.pointerController) {
        this.pointerController.getTipItem().removeChildByHandle(this.uiPointerItem)
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
   * @param length - The length param.
   */
  setPointerLength(length: number): void {
    this.pointerLocalXfo.sc.set(1, 1, length)
    this.uiPointerItem.localXfoParam.value = this.pointerLocalXfo
  }

  calcPointerRay(): Ray {
    const pointerXfo = this.uiPointerItem.globalXfoParam.value
    const pointerVec = pointerXfo.ori.getZaxis().negate()
    const ray = new Ray(pointerXfo.tr, pointerVec)
    return ray
  }

  private calcUIIntersection(ray: Ray): UIIntersection | null {
    // const pointerXfo = this.uiPointerItem.globalXfoParam.value
    // const pointerVec = pointerXfo.ori.getZaxis().negate()
    // const ray = new Ray(pointerXfo.tr, pointerVec)

    const planeXfo = this.controllerUI.globalXfoParam.value
    const planeSize = this.controllerUI.size.multiply(planeXfo.sc)

    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate())
    const res = ray.intersectRayPlane(plane)
    if (res <= 0) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    const hitOffset = ray.start.add(ray.dir.scale(res)).subtract(plane.start)
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeSize.x
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeSize.y
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      // Let the pointer shine right past the UI.
      this.setPointerLength(0.5)
      return
    }
    this.setPointerLength(res / planeXfo.sc.z)
    const rect = this.vrUIDOMElement.getBoundingClientRect()
    return {
      clientX: Math.round(x * -rect.width + rect.width / 2),
      clientY: Math.round(y * -rect.height + rect.height / 2),
    }
  }

  private getDOMElementFromPoint(hit: UIIntersection): Element {
    let element = document.elementFromPoint(hit.clientX, hit.clientY)
    if (element) {
      // @ts-ignore
      if (element.shadowRoot) {
        element = element.shadowRoot.elementFromPoint(hit.clientX, hit.clientY)
      }
    }
    return element
  }

  /**
   * The sendEventToUI method.
   * @param eventName - The eventName param.
   * @param args - The args param.
   * @return The return value.
   */
  sendEventToUI(element: Element, eventName: string, hit: UIIntersection, args: Record<string, any> = {}): void {
    args.offsetX = args.pageX = args.pageX = args.screenX = hit.clientX
    args.offsetY = args.pageY = args.pageY = args.screenY = hit.clientY
    this.controllerUI.sendMouseEvent(element, eventName, args)
  }

  /**
   * The onVRControllerButtonDown method.
   * @param event - The event param.
   */
  onPointerDown(event: XRControllerEvent): void {
    if (event.pointerType === POINTER_TYPES.mouse) {
      if (this.uiOpen) {
        const ray = event.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)
          this.sendEventToUI(element, 'mousedown', hit, { button: 0 })

          // While the UI is open, no other tools get events.
          this.triggerHeld = true
          event.stopPropagation()
        }
      }
    } else if (event.pointerType === POINTER_TYPES.xr) {
      if (event.controller == this.pointerController && this.uiOpen) {
        const ray = this.calcPointerRay()
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)
          this.sendEventToUI(element, 'mousedown', hit, {
            button: event.button - 1,
          })
          // While the UI is open, no other tools get events.
          this.triggerHeld = true
          event.stopPropagation()
        }
      }
    }
  }

  /**
   * The onVRControllerButtonUp method.
   * @param event - The event param.
   */
  onPointerUp(event: XRControllerEvent): void {
    if (event.pointerType === POINTER_TYPES.mouse) {
      if (this.triggerHeld) {
        // While the UI is open, no other tools get events.
        event.stopPropagation()
        this.triggerHeld = false
      }
      if (this.uiOpen) {
        const ray = event.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const target = this.getDOMElementFromPoint(hit)
          if (target) {
            this.sendEventToUI(target, 'mouseup', hit, {
              button: event.button - 1,
            })
          }
        }
      }
    } else if (event.pointerType === POINTER_TYPES.xr) {
      if (event.controller == this.pointerController && this.uiOpen) {
        const ray = this.calcPointerRay()
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)
          if (element) {
            this.sendEventToUI(element, 'mouseup', hit, {
              button: event.button - 1,
            })
          }
        }
        // While the UI is open, no other tools get events.
        event.stopPropagation()
      }
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param event - The event param.
   */
  onPointerMove(event: XRPoseEvent): void {
    if (event.pointerType === POINTER_TYPES.mouse) {
      if (this.uiOpen) {
        const ray = event.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)

          if (element != this.element) {
            if (this.element) {
              this.sendEventToUI(this.element, 'mouseleave', hit, {})
            }
            this.element = element
            if (this.element) {
              this.sendEventToUI(this.element, 'mouseenter', hit, {})
            }
          }
          if (this.element) {
            this.sendEventToUI(this.element, 'mousemove', hit, {})
          }

          event.stopPropagation()
        } else if (this.element) {
          this.controllerUI.sendMouseEvent(this.element, 'mouseleave', {})
          this.element = null
        }
      }
    } else if (event.pointerType === POINTER_TYPES.xr) {
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
        const checkControllers = (ctrlA: any, ctrlB: any) => {
          // Note: do not open the UI when the controller buttons are pressed.
          const xfoA = ctrlA.getTreeItem().globalXfoParam.value
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
          const xfoA = this.uiController.getTreeItem().globalXfoParam.value
          const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
          headToCtrlA.normalizeInPlace()
          if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) > Math.PI * 0.5) {
            // Remove ourself from the system.
            this.closeUI()
            if (event.getCapture() == this) {
              event.releaseCapture()
            }
            return false
          }
          return true
        }

        if (checkControllers()) {
          const ray = this.calcPointerRay()
          const hit = this.calcUIIntersection(ray)
          if (hit) {
            const element = this.getDOMElementFromPoint(hit)

            if (element != this.element) {
              if (this.element) {
                this.sendEventToUI(this.element, 'mouseleave', hit, {})
              }
              this.element = element
              if (this.element) {
                this.sendEventToUI(this.element, 'mouseenter', hit, {})
              }
            }
            if (this.element) {
              this.sendEventToUI(this.element, 'mousemove', hit, {})
            }
          } else if (this.element) {
            this.controllerUI.sendMouseEvent(this.element, 'mouseleave', {})
            this.element = null
          }
        }
        // While the UI is open, no other tools get events.
        event.stopPropagation()
      }
    }
  }

  /**
   * Event fired when the user presses down a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyDown(event: ZeaKeyboardEvent) {}
  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param event - The event param.
   */
  onKeyUp(event: ZeaKeyboardEvent): void {
    if (event.key == this.openUIKeyboardHotkey) {
      if (!this.uiOpen) {
        this.controllerUI.activate()

        const viewport = event.viewport as GLViewport
        const camera = viewport.getCamera()
        const xfo = camera.globalXfoParam.value.clone()
        xfo.tr.addInPlace(xfo.ori.getZaxis().scale(-0.75))

        const rot = new Quat()
        rot.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI)
        xfo.ori.multiplyInPlace(rot)
        camera.setFocalDistance(0.75)
        this.controllerUI.globalXfoParam.value = xfo

        this.appData.renderer.addTreeItem(this.controllerUI)

        this.uiOpen = true
      } else {
        this.controllerUI.deactivate()

        // To debug the UI in the renderer without being in VR, enable this line.
        this.appData.renderer.removeTreeItem(this.controllerUI)

        this.uiOpen = false
      }

      // this.controllerUI.localXfoParam.value = new
    }
  }
}

export default VRUITool
export { VRUITool }
