import {
  BaseTool,
  CADAsset,
  TreeItem,
  VRViewport,
  XRController,
  Xfo,
  ZeaKeyboardEvent,
  ZeaPointerEvent,
  ZeaTouchEvent,
} from '@zeainc/zea-engine'
import { AppData } from '../../../types/types'

class HandHeldTool extends BaseTool {
  appData: AppData
  cadAsset: CADAsset
  toolController: XRController
  private children: TreeItem[] = []
  constructor(assetUrl: string, offsetXfo: Xfo, appData: AppData) {
    super()
    this.appData = appData

    this.cadAsset = new CADAsset('cow')
    this.cadAsset.localXfoParam.value = offsetXfo
    this.cadAsset.load(assetUrl)
  }

  /**
   * Enables tools usage. This method is called by either the Viewport when a tool is removed, or the ToolManage if it is installed.
   */
  activateTool(): void {
    super.activateTool()

    // this.appData.renderer.getGLCanvas().style.cursor = 'crosshair'

    const addToolToController = (controller: XRController) => {
      const treeIem = controller.getTreeItem()

      // cache the original controller geometry.
      treeIem.getChildren().forEach((child) => this.children.push(child))
      treeIem.removeAllChildren()

      controller.getTreeItem().addChild(this.cadAsset, false)
      this.toolController = controller
    }

    const checkController = (controller: XRController, headXfo: Xfo) => {
      // Note: do not open the UI when the controller buttons are pressed.
      const xfoA = controller.getTreeItem().globalXfoParam.value
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
      headToCtrlA.normalizeInPlace()
      if (headToCtrlA.angleTo(headXfo.ori.getZaxis()) < Math.PI * 0.25) {
        return true
      }

      return false
    }
    this.appData.renderer.getXRViewport().then((xrvp) => {
      if (xrvp instanceof VRViewport) {
        const headXfo = xrvp.getVRHead().getTreeItem().globalXfoParam.value
        for (const controller of xrvp.getControllers()) {
          if (checkController(controller, headXfo)) {
            addToolToController(controller)
            break
          }
        }
      }
    })
  }
  /**
   * Disables tool usage. This method is called by either the Viewport when a tool is removed, or the ToolManage if it is installed.
   */
  deactivateTool() {
    super.deactivateTool()
    if (this.toolController) {
      const treeIem = this.toolController.getTreeItem()
      treeIem.removeChildByHandle(this.cadAsset)
      // restore the original controller geometry.
      this.children.forEach((child) => treeIem.addChild(child, false))
      this.children = []
      this.toolController = null
    }
  }

  /**
   * Event fired when either the mouse button is pressed, or a touch start event occurs.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent) {}
  /**
   * Event fired when either the mouse cursor is moved, or a touch point moves.
   *
   * @param event - The event param.
   */
  onPointerMove(event: ZeaPointerEvent) {}
  /**
   * Event fired when either the mouse button is released, or a touch end event occurs.
   *
   * @param event - The event param.
   */
  onPointerUp(event: ZeaPointerEvent) {}
  /**
   * Event fired when a pointing device button is clicked.
   *
   * @param event - The event param.
   */
  onPointerClick(event: ZeaPointerEvent) {}
  /**
   * Event fired when a pointing device button is double clicked.
   *
   * @param event - The event param.
   */
  onPointerDoubleClick(event: ZeaPointerEvent) {}
  /**
   * Event fired when a pointing device button is held for a long time..
   *
   * @param event - The event param.
   */
  onPointerLongPress(event: ZeaPointerEvent) {}
  /**
   * Event fired when a mouse pointer enters the viewport
   *
   * @param event - The event param.
   */
  onPointerEnter(event: ZeaPointerEvent) {}
  /**
   * Event fired when a mouse pointer leaves the viewport
   *
   * @param event - The event param.
   */
  onPointerLeave(event: ZeaPointerEvent) {}
  /**
   * Event fired when the user rotates the pointing device wheel.
   *
   * @param event - The event param.
   */
  onWheel(event: ZeaPointerEvent) {}
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
  onKeyUp(event: ZeaKeyboardEvent) {}
  /**
   * Event fired when one or more touch points have been disrupted in an implementation-specific manner.
   *
   * @param event - The event param.
   */
  onTouchCancel(event: ZeaTouchEvent) {}
}

export { HandHeldTool }
