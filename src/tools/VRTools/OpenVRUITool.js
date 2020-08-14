import BaseTool from '../BaseTool'

/**
 * Class representing an open VR UI tool.
 *
 * @extends BaseTool
 */
class OpenVRUITool extends BaseTool {
  /**
   * Create an open VR UI tool.
   * @param {object} appData - The appData value.
   * @param {VRUITool} vrUITool - The vrUITool value.
   */
  constructor(appData, vrUITool) {
    super(appData)

    this.vrUITool = vrUITool
    this.uiToolIndex = -1
    this.__stayClosed = false
  }

  /**
   * The uninstall method.
   */
  uninstall() {
    super.uninstall()

    // Also remove the UI tool
    if (this.uiToolIndex > 0) this.appData.toolManager.removeToolByHandle(this.vrUITool)
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonDown(event) {}

  /**
   * The onVRControllerButtonUp method.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonUp(event) {}

  /**
   * The stayClosed method.
   */
  stayClosed() {
    this.__stayClosed = true
  }

  /**
   * The onVRPoseChanged method.
   *
   * @param {object} event - The event param.
   * @return {boolean} The return value.
   */
  onVRPoseChanged(event) {
    if (this.vrUITool.installed()) return

    // Controller coordinate system
    // X = Horizontal.
    // Y = Up.
    // Z = Towards handle base.
    const headXfo = event.viewXfo
    const checkControllers = (ctrlA, ctrlB) => {
      if (!ctrlA) return false
      const xfoA = ctrlA.getTreeItem().getParameter('GlobalXfo').getValue()
      const headToCtrlA = xfoA.tr.subtract(headXfo.tr)
      headToCtrlA.normalizeInPlace()
      if (headToCtrlA.angleTo(xfoA.ori.getYaxis()) < Math.PI * 0.25) {
        // Stay closed as a subsequent tool has just caused the UI to be
        // closed while interacting with the UI. (see: VRUITool.deactivateTool)
        if (!this.__stayClosed) {
          this.vrUITool.setUIControllers(this, ctrlA, ctrlB, headXfo)
          this.uiToolIndex = this.appData.toolManager.pushTool(this.vrUITool)
        }
        return true
      }
    }

    if (event.controllers.length > 0) {
      if (checkControllers(event.controllers[0], event.controllers[1])) return true
      if (checkControllers(event.controllers[1], event.controllers[0])) return true
    }
    this.uiToolIndex = -1
    this.__stayClosed = false
  }
}

export default OpenVRUITool
export { OpenVRUITool }
