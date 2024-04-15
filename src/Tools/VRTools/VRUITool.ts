import {
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
  ZeaPointerEvent,
  ZeaMouseEvent,
  EulerAngles,
  MathFunctions,
  TreeItem,
  VRViewport,
  LinesMaterial,
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
  private uiOpenedByMouse: boolean = false
  private triggerHeld: boolean = false

  private visibilityStates: Record<string, boolean[]> = {}
  private uiController: XRController
  private pointerController: any
  private element: Element
  private openUIKeyboardHotkey = 'u'

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

    const pointermat = new LinesMaterial('pointermat')
    pointermat.setSelectable(false)
    pointermat.baseColorParam.value = new Color(1, 0, 0)
    pointermat.overlayParam.value = 0.5

    const line = new Lines()
    line.setNumVertices(2)
    line.setNumSegments(1)
    line.setSegmentVertexIndices(0, 0, 1)
    const positions = <Vec3Attribute>line.getVertexAttribute('positions')
    positions.setValue(0, new Vec3(0, 0, 0))
    positions.setValue(1, new Vec3(0, 0, -1))
    line.setBoundingBoxDirty()
    this.pointerLocalXfo = new Xfo()
    this.pointerLocalXfo.sc.set(1, 1, 0.1)

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
   * The openUI method.
   * @param uiController - The uiController param.
   * @param : VRController - The pointerController param.
   * @param headXfo - The headXfo param.
   */
  openUI(uiController: XRController, pointerController: XRController): void {
    this.controllerUI.activate()
    this.uiController = uiController
    this.pointerController = pointerController

    const showFirstChild = (handedness: string, treeItem: TreeItem) => {
      const currentStates: boolean[] = []
      treeItem.getChildren().forEach((child, index) => {
        currentStates.push(child.visibleParam.value)
        child.visibleParam.value = index < 2
      })
      this.visibilityStates[handedness] = currentStates
    }
    showFirstChild(this.uiController.getHandedness(), this.uiController.getTreeItem())
    showFirstChild(this.pointerController.getHandedness(), this.pointerController.getTreeItem())

    const uiLocalXfo = this.controllerUI.localXfoParam.value
    // uiLocalXfo.tr.set(0, -0.05, 0.08)

    if (this.pointerController) {
      // display the UI on the top of the thumb knuckle.
      // Controller coordinate system
      // X = Horizontal.
      // Y = Down
      // Z = Towards handle base.
      if (uiController.getHandedness() == 'right') {
        const eulerAngles = new EulerAngles(-MathFunctions.degToRad(90), MathFunctions.degToRad(90), 0, 'XYZ')
        uiLocalXfo.ori.setFromEulerAngles(eulerAngles)
        uiLocalXfo.tr.set(-0.05, -0.02, 0.15)
      } else {
        const eulerAngles = new EulerAngles(-MathFunctions.degToRad(90), -MathFunctions.degToRad(90), 0, 'XYZ')
        uiLocalXfo.ori.setFromEulerAngles(eulerAngles)
        uiLocalXfo.tr.set(0.05, -0.1, 0.15)
      }
    } else {
      // uiLocalXfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.6)
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

      // Any tool geoemtry should be restored to is previous visibility state.
      const restoreVibility = (handedness: string, treeItem: TreeItem) => {
        const currentStates: boolean[] = this.visibilityStates[handedness]
        treeItem.getChildren().forEach((child, index) => {
          if (index < currentStates.length) {
            child.visibleParam.value = currentStates[index]
          }
        })
      }
      restoreVibility(this.uiController.getHandedness(), this.uiController.getTreeItem())
      restoreVibility(this.pointerController.getHandedness(), this.pointerController.getTreeItem())

      if (this.appData.session) {
        this.appData.session.pub('pose-message', {
          interfaceType: 'VR',
          closehideUIPanel: {
            controllerId: this.uiController.getId(),
          },
        })
      }
    }
    if (this.uiOpenedByMouse) {
      this.appData.renderer.removeTreeItem(this.controllerUI)
    }
    this.uiOpen = false
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The setPointerLength method.
   * @param length - The length param.
   */
  private setPointerLength(length: number): void {
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
    if (!this.controllerUI.ready) return null

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
   * The onXRControllerButtonDown method.
   * @param event - The event param.
   */
  onPointerDown(event: XRControllerEvent): void {
    if (event instanceof ZeaMouseEvent) {
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
    } else if (event instanceof XRControllerEvent) {
      if (this.uiOpen) {
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
  onPointerUp(event: ZeaPointerEvent): void {
    if (event instanceof ZeaMouseEvent) {
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
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
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
          event.stopPropagation()
        }
      }
    }
  }

  /**
   * Event fired when a pointing device button is clicked.
   *
   * @param event - The event param.
   */
  onPointerClick(event: ZeaPointerEvent) {
    if (event instanceof ZeaMouseEvent) {
      if (this.uiOpen) {
        const ray = event.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const target = this.getDOMElementFromPoint(hit)
          if (target) {
            this.sendEventToUI(target, 'click', hit, {
              button: event.button - 1,
            })
          }
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
      if (event.button == 4) {
        if (!this.uiOpen) {
          const uiController = event.controller
          // Controller coordinate system
          // X = Horizontal.
          // Y = Down
          // Z = Towards handle base.
          const vrvp = uiController.xrvp as VRViewport
          const headXfo = vrvp.getVRHead().getTreeItem().globalXfoParam.value
          // Note: do not open the UI when the controller buttons are pressed.
          const controllerXfo = uiController.getTreeItem().globalXfoParam.value
          const headToCtrlA = controllerXfo.tr.subtract(headXfo.tr)
          headToCtrlA.normalizeInPlace()
          const controllerXAxis =
            uiController.getHandedness() == 'left'
              ? controllerXfo.ori.getXaxis().negate()
              : controllerXfo.ori.getXaxis()
          const angle = headToCtrlA.angleTo(controllerXAxis)
          if (angle < 0.3) {
            const controllers = uiController.xrvp.controllers
            const pointerController = controllers.find((ctrl) => ctrl != uiController)
            this.openUI(uiController, pointerController)
            event.setCapture(this)
            event.stopPropagation()
          }
        } else {
          this.closeUI()
          event.releaseCapture()
          event.stopPropagation()
        }
        return
      } else if (this.uiOpen && event.controller == this.pointerController) {
        const ray = this.calcPointerRay()
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)
          if (element) {
            this.sendEventToUI(element, 'click', hit, {
              button: event.button - 1,
            })
          }
          event.stopPropagation()
        }
      }
    }
  }

  onPointerDoubleClick(event: ZeaPointerEvent) {
    if (event instanceof ZeaMouseEvent) {
      if (this.uiOpen) {
        const ray = event.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          // While the UI is open, no other tools get events.
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
      if (event.controller == this.pointerController && this.uiOpen) {
        const ray = this.calcPointerRay()
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          event.stopPropagation()
        }
      }
    }
  }

  /**
   * The onXRPoseChanged method.
   * @param event - The event param.
   */
  onPointerMove(event: XRPoseEvent): void {
    if (event instanceof ZeaMouseEvent) {
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
          event.stopPropagation()
        } else if (this.element) {
          this.controllerUI.sendMouseEvent(this.element, 'mouseleave', {})
          this.element = null
        }
      }
    } else if (event instanceof XRPoseEvent) {
      if (this.uiOpen) {
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

          event.stopPropagation()
        } else if (this.element) {
          this.controllerUI.sendMouseEvent(this.element, 'mouseleave', {})
          this.element = null
        }
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

        this.uiOpenedByMouse = true
        this.uiOpen = true
      } else {
        this.controllerUI.deactivate()

        // To debug the UI in the renderer without being in VR, enable this line.
        this.appData.renderer.removeTreeItem(this.controllerUI)

        this.uiOpen = false
        this.uiOpenedByMouse = false
      }

      // this.controllerUI.localXfoParam.value = new
    }
  }
}

export default VRUITool
export { VRUITool }
