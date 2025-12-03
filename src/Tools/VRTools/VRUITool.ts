import {
  Vec3,
  Color,
  Ray,
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
  VRViewport,
  LinesMaterial,
  TreeItem,
  ChildAddedEvent,
} from '@zeainc/zea-engine'

import { AppData } from '../../../types/types'
import VRControllerUI from './VRControllerUI'
import { PointerTool } from './PointerTool'

interface UIIntersection {
  clientX: number
  clientY: number
}

/**
 * Class representing a VR UI tool.
 *
 * @extends BaseTool
 */
class VRUITool extends PointerTool {
  private vrUIDOMElement: HTMLElement
  private controllerUI: VRControllerUI

  private uiOpen: boolean = false
  private uiOpenedByMouse: boolean = false
  private triggerHeld: boolean = false

  private visibilityStates: Map<XRController, Map<TreeItem, boolean>> = new Map()
  private uiController: XRController
  private element: Element

  private listenerIds: Map<XRController, Record<string, number>> = new Map()

  public openUIKeyboardHotkey = 'u'
  public openUiAngleTolerance = 0.7

  /**
   * Create a VR UI tool.
   * @param appData - The appData value.
   * @param vrUIDOMElement - The  dom element we will use as the VR UI
   */
  constructor(appData: AppData, vrUIDOMElement: HTMLElement) {
    super(appData)

    this.vrUIDOMElement = vrUIDOMElement
    this.controllerUI = new VRControllerUI(appData, this.vrUIDOMElement)
    this.raycastDist = 0.0

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
    // super.activateTool()

    this.emit('activatedChanged', { activated: true })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool(): void {
    if (this.uiOpen) this.closeUI()
    // super.deactivateTool()
    this.emit('activatedChanged', { activated: false })
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

    this.displayPointers()
    this.setPointerLength(0.5, this.pointerController)

    // Ensure the Controllers are both visible.
    const uiController_controllerTree = this.uiController.getTreeItem().getChild(1)
    if (uiController_controllerTree) uiController_controllerTree.visibleParam.value = true
    const pointerController_controllerTree = this.pointerController.getTreeItem().getChild(1)
    if (pointerController_controllerTree) pointerController_controllerTree.visibleParam.value = true

    const uiController_listenerIds: Record<string, number> = {}
    const pointerController_listenerIds: Record<string, number> = {}
    this.listenerIds.set(uiController, uiController_listenerIds)
    this.listenerIds.set(pointerController, pointerController_listenerIds)
    this.visibilityStates.set(this.uiController, new Map<TreeItem, boolean>())
    this.visibilityStates.set(this.pointerController, new Map<TreeItem, boolean>())

    // this.storeVisibility(this.uiController, this.uiController.getTreeItem())
    // this.storeVisibility(this.uiController, this.uiController.getTipItem())
    // this.storeVisibility(this.pointerController, this.pointerController.getTreeItem())
    // this.storeVisibility(this.pointerController, this.pointerController.getTipItem())

    const uiLocalXfo = this.controllerUI.localXfoParam.value

    // display the UI on the top of the thumb knuckle.
    // Controller coordinate system
    // X = Horizontal.
    // Y = Down
    // Z = Towards handle base.
    if (this.uiController.getHandedness() == 'right') {
      const eulerAngles = new EulerAngles(-MathFunctions.degToRad(90), MathFunctions.degToRad(90), 0, 'XYZ')
      uiLocalXfo.ori = eulerAngles.toQuat()
      uiLocalXfo.tr.set(-0.05, 0, -0.05)
    } else {
      const eulerAngles = new EulerAngles(-MathFunctions.degToRad(90), -MathFunctions.degToRad(90), 0, 'XYZ')
      uiLocalXfo.ori = eulerAngles.toQuat()
      uiLocalXfo.tr.set(0.05, 0, -0.05)
    }

    this.controllerUI.localXfoParam.value = uiLocalXfo
    this.controllerUI.visibleParam.value = true

    this.uiController.getTreeItem().addChild(this.controllerUI, false)

    if (this.appData.session) {
      const postMessage = () => {
        this.appData.session.pub('poseChanged', {
          interfaceType: 'VR',
          showUIPanel: {
            controllerId: this.uiController.id,
            xfo: uiLocalXfo,
            size: this.controllerUI.size,
          },
        })
      }
      if (!this.controllerUI.ready) {
        this.controllerUI.on('ready', postMessage)
      } else {
        postMessage()
      }
    }

    pointerController_listenerIds['treeItem_childAdded'] = this.pointerController
      .getTreeItem()
      .on('childAdded', (event: ChildAddedEvent) => this.childAdded(this.pointerController, event.childItem))

    pointerController_listenerIds['tipItem_childAdded'] = this.pointerController
      .getTipItem()
      .on('childAdded', (event: ChildAddedEvent) => this.childAdded(this.pointerController, event.childItem))

    this.uiOpen = true
  }

  private childAdded(controller: XRController, childItem: TreeItem) {
    const currentStates: Map<TreeItem, boolean> = this.visibilityStates.get(controller)
    currentStates.set(childItem, childItem.visibleParam.value)
    childItem.visibleParam.value = false
  }

  // private storeVisibility(controller: XRController, treeItem: TreeItem) {
  //   const currentStates = new Map<TreeItem, boolean>()
  //   treeItem.getChildren().forEach((childItem, index) => {
  //     currentStates.set(childItem, childItem.visibleParam.value)
  //     childItem.visibleParam.value = !childItem.visibleParam.value
  //   })
  //   this.visibilityStates.set(controller, currentStates)
  // }

  private restoreVisibility(controller: XRController, value: boolean) {
    const currentStates: Map<TreeItem, boolean> = this.visibilityStates.get(controller)
    currentStates.forEach((_, geomItem) => {
      geomItem.visibleParam.value = value
    })
  }

  /**
   * The closeUI method.
   */
  closeUI(): void {
    if (!this.uiOpen) return
    this.controllerUI.deactivate()

    this.removePointers()

    if (this.uiOpenedByMouse) {
      this.appData.renderer.removeTreeItem(this.controllerUI)
    } else {
      this.controllerUI.visibleParam.value = false
      this.uiController.getTreeItem().removeChildByHandle(this.controllerUI)

      // this.uiPointerItem.visibleParam.value = false
      // this.pointerController.getTipItem().removeChildByHandle(this.uiPointerItem)

      // Any tool geometry should be restored to is previous visibility state.
      this.restoreVisibility(this.uiController, true)
      const pointerController_listenerIds = this.listenerIds.get(this.pointerController)
      this.pointerController.getTreeItem().off('childAdded', pointerController_listenerIds['treeItem_childAdded'])
      this.pointerController.getTipItem().off('childAdded', pointerController_listenerIds['tipItem_childAdded'])

      if (this.appData.session) {
        this.appData.session.pub('poseChanged', {
          interfaceType: 'VR',
          hideUIPanel: {
            controllerId: this.uiController.id,
          },
        })
      }
    }
    this.uiOpen = false
  }

  // ///////////////////////////////////
  // VRController events

  private calcUIIntersection(ray: Ray): UIIntersection | null {
    if (!this.controllerUI.ready) return null

    const planeXfo = this.controllerUI.globalXfoParam.value
    const planeSize = this.controllerUI.size.multiply(planeXfo.sc)

    const plane = new Ray(planeXfo.tr, planeXfo.ori.getZaxis().negate())
    const res = ray.intersectRayPlane(plane)
    if (res <= 0) {
      return
    }
    const hitOffset = ray.start.add(ray.dir.scale(res)).subtract(plane.start)
    const x = hitOffset.dot(planeXfo.ori.getXaxis()) / planeSize.x
    const y = hitOffset.dot(planeXfo.ori.getYaxis()) / planeSize.y
    if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      return
    }
    if (this.pointerController) {
      this.setPointerLength(res, this.pointerController)
    }
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
  sendEventToUI(
    controller: XRController,
    element: Element,
    eventName: string,
    hit: UIIntersection,
    args: Record<string, any> = {}
  ): void {
    args.offsetX = args.pageX = args.pageX = args.screenX = hit.clientX
    args.offsetY = args.pageY = args.pageY = args.screenY = hit.clientY
    this.controllerUI.sendMouseEvent(controller, element, eventName, args)
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
          this.sendEventToUI(null, element, 'mousedown', hit, { button: 0 })

          // While the UI is open, no other tools get events.
          this.triggerHeld = true
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

          if (angle < this.openUiAngleTolerance) {
            const controllers = uiController.xrvp.controllers
            const pointerController = controllers.find((ctrl) => ctrl != uiController)
            if (pointerController) {
              this.openUI(uiController, pointerController)
            }
            event.setCapture(this)
            event.stopPropagation()
          }
        } else {
          this.closeUI()
          event.releaseCapture()
          event.stopPropagation()
        }
      } else if (event.button == 0) {
        if (this.uiOpen && event.controller == this.pointerController) {
          const ray = this.pointerController.pointerRay
          const hit = this.calcUIIntersection(ray)
          if (hit) {
            const element = this.getDOMElementFromPoint(hit)
            this.sendEventToUI(event.controller, element, 'mousedown', hit, {
              button: event.button,
            })
            // While the UI is open, no other tools get events.
            this.triggerHeld = true
            event.stopPropagation()
          }
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
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
      if (this.uiOpen && event.controller == this.pointerController && event.button == 0) {
        const ray = this.pointerController.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
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
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
      if (this.uiOpen && event.controller == this.pointerController && event.button == 0) {
        const ray = this.pointerController.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
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
            this.sendEventToUI(null, target, 'mouseup', hit, {
              button: event.button,
            })
          }
          event.stopPropagation()
        }
      }
    } else if (event instanceof XRControllerEvent) {
      if (this.uiOpen && event.controller == this.pointerController && event.button == 0) {
        const ray = this.pointerController.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)
          if (element) {
            this.sendEventToUI(event.controller, element, 'mouseup', hit, {
              button: event.button,
            })
          }
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
              this.sendEventToUI(null, this.element, 'mouseleave', hit)
            }
            this.element = element
            if (this.element) {
              this.sendEventToUI(null, this.element, 'mouseenter', hit)
            }
          }
          event.stopPropagation()
        } else if (this.element) {
          this.controllerUI.sendMouseEvent(null, this.element, 'mouseleave')
          this.element = null
        }
      }
    } else if (event instanceof XRPoseEvent) {
      if (this.uiOpen) {
        const ray = this.pointerController.pointerRay
        const hit = this.calcUIIntersection(ray)
        if (hit) {
          const element = this.getDOMElementFromPoint(hit)

          if (element != this.element) {
            if (this.element) {
              this.sendEventToUI(this.pointerController, this.element, 'mouseleave', hit)
            }
            this.element = element
            if (this.element) {
              this.sendEventToUI(this.pointerController, this.element, 'mouseenter', hit)
            }
          }
          if (this.element) {
            this.sendEventToUI(this.pointerController, this.element, 'mousemove', hit)
          }

          event.stopPropagation()
          this.restoreVisibility(this.pointerController, false)
        } else if (this.element) {
          // Let the pointer shine right past the UI.
          this.setPointerLength(0.5, this.pointerController)
          this.controllerUI.sendMouseEvent(this.pointerController, this.element, 'mouseleave')
          this.element = null

          this.restoreVisibility(this.pointerController, true)
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
        camera.focalDistanceParam.value = 0.75
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
