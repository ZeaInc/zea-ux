import { ParameterOwner } from '@zeainc/zea-engine'

/**
 * Class representing a base tool.
 * @extends ParameterOwner
 */
export default class BaseTool extends ParameterOwner {
  /**
   * Create a base tool.
   * @param {any} appData - The appData value.
   */
  constructor(appData) {
    super()
    if (!appData) console.error('App data not provided to tool')
    this.appData = appData

    this.__params = []
    this.__installed = false
    this.__activated = false
  }

  /**
   * The getName method.
   * @return {any} The return value.
   */
  getName() {
    return this.constructor.name
  }

  /**
   * The isPrimaryTool method.
   * @return {any} The return value.
   */
  isPrimaryTool() {
    return false
  }

  // ///////////////////////////////////
  // Tools on the tool stack.

  /**
   * The installed method.
   * @return {any} The return value.
   */
  installed() {
    return this.__installed
  }

  /**
   * The install method.
   * @param {any} index - The index param.
   */
  install(index) {
    if (this.__installed) throw new Error('Tool already installed')
    this.index = index
    this.__installed = true
    this.emit('installChanged', { installed: this.__installed })
  }

  /**
   * The uninstall method.
   */
  uninstall() {
    this.__installed = false
    this.emit('installChanged', { installed: this.__installed })
  }

  /**
   * The activateTool method.
   */
  activateTool() {
    if (this.__activated) throw new Error('Tool already activate')
    this.__activated = true
    this.emit('activatedChanged', { activated: this.__activated })
  }

  /**
   * The deactivateTool method.
   */
  deactivateTool() {
    this.__activated = false
    this.emit('activatedChanged', { activated: this.__activated })
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The onMouseDown method.
   * @param {any} event - The event param.
   */
  onMouseDown(event) {}

  /**
   * The onMouseMove method.
   * @param {any} event - The event param.
   */
  onMouseMove(event) {}

  /**
   * The onMouseUp method.
   * @param {any} event - The event param.
   */
  onMouseUp(event) {}

  /**
   * The onDoubleClick method.
   * @param {any} event - The event param.
   */
  onDoubleClick(event) {}

  /**
   * The onWheel method.
   * @param {any} event - The event param.
   */
  onWheel(event) {}

  // ///////////////////////////////////
  // Keyboard events

  /**
   * The onKeyPressed method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyPressed(event) {}

  /**
   * The onKeyDown method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyDown(event) {}

  /**
   * The onKeyUp method.
   * @param {any} key - The key param.
   * @param {any} event - The event param.
   */
  onKeyUp(event) {}

  // ///////////////////////////////////
  // Touch events

  /**
   * The onTouchStart method.
   * @param {any} event - The event param.
   */
  onTouchStart(event) {}

  /**
   * The onTouchMove method.
   * @param {any} event - The event param.
   */
  onTouchMove(event) {}

  /**
   * The onTouchEnd method.
   * @param {any} event - The event param.
   */
  onTouchEnd(event) {}

  /**
   * The onTouchCancel method.
   * @param {any} event - The event param.
   */
  onTouchCancel(event) {}

  /**
   * The onDoubleTap method.
   * @param {any} event - The event param.
   */
  onDoubleTap(event) {}

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonDown(event) {}

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   */
  onVRControllerButtonUp(event) {}

  /**
   * The onVRControllerDoubleClicked method.
   * @param {any} event - The event param.
   */
  onVRControllerDoubleClicked(event) {}

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   */
  onVRPoseChanged(event) {}
}
