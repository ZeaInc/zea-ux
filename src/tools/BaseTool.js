import { ParameterOwner } from '@zeainc/zea-engine'

/**
 * Abstract class representing a tool with methods representing mouse, keyboard, touch and VR events.
 *
 * **Events**
 * * **installChanged:** Triggered when the tool is installed or uninstalled.
 * * **activatedChanged:** Triggered when a tool is activated or deactivated.
 *
 * @extends ParameterOwner
 */
class BaseTool extends ParameterOwner {
  /**
   * Creates an instance of BaseTool.
   *
   * @param {object} appData - The appData value.
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
   * Returns the name of the tool class.
   *
   * @return {string} The return value.
   */
  getName() {
    return this.constructor.name
  }

  /**
   * Checks if the tool is a primary tool or not.
   *
   * @return {boolean} - The return value.
   */
  isPrimaryTool() {
    return false
  }

  // ///////////////////////////////////
  // Tools on the tool stack.

  /**
   * Checks whether the tool is already installed or not.
   *
   * @return {boolean} The return value.
   */
  installed() {
    return this.__installed
  }

  /**
   * Installs the tool.
   *
   * @param {number} index - The index param.
   */
  install(index) {
    if (this.__installed) throw new Error('Tool already installed')
    this.index = index
    this.__installed = true
    this.emit('installChanged', { installed: this.__installed })
  }

  /**
   * Uninstalls tool.
   */
  uninstall() {
    this.__installed = false
    this.emit('installChanged', { installed: this.__installed })
  }

  /**
   * Enables tools usage.
   */
  activateTool() {
    if (this.__activated) throw new Error('Tool already activate')
    this.__activated = true
    this.emit('activatedChanged', { activated: this.__activated })
  }

  /**
   * Disables tool usage.
   */
  deactivateTool() {
    this.__activated = false
    this.emit('activatedChanged', { activated: this.__activated })
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the tool.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseDown(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a pointing device is moved while the cursor's hotspot is inside it.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseMove(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a pointing device button is released while the pointer is over the tool.
   *
   * @param {MouseEvent} event - The event param.
   */
  onMouseUp(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a pointing device button is double clicked on the tool.
   *
   * @param {MouseEvent} event - The event param.
   */
  onDoubleClick(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when the user rotates the pointing device wheel.
   *
   * @param {MouseEvent} event - The event param.
   */
  onWheel(event) {
    console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Keyboard events

  /**
   * Event fired when the user presses a key on the keyboard.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyPressed(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when the user presses down a key on the keyboard.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyDown(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when the user releases a key on the keyboard.
   *
   * @param {KeyboardEvent} event - The event param.
   */
  onKeyUp(event) {
    console.warn('Implement me')
  }

  // ///////////////////////////////////
  // Touch events

  /**
   * Event fired when one or more touch points are placed on the touch surface over a tool.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchStart(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when the one or more touch points are moved along the touch surface over a tool.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchMove(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when one or more touch points are removed from the touch surface over a tool.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchEnd(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when one or more touch points have been disrupted in an implementation-specific manner.
   *
   * @param {TouchEvent} event - The event param.
   */
  onTouchCancel(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when two continuos touch point are placed on the touch surface over a tool.
   *
   * @param {TouchEvent} event - The event param.
   */
  onDoubleTap(event) {
    console.warn('Implement me')
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * Event fired when a VR controller button is pressed over a tool.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonDown(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a VR controller button is released over a tool.
   *
   * @param {object} event - The event param.
   */
  onVRControllerButtonUp(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a VR controller button is pressed twice over a tool.
   *
   * @param {object} event - The event param.
   */
  onVRControllerDoubleClicked(event) {
    console.warn('Implement me')
  }

  /**
   * Event fired when a VR controller...
   *
   * @param {object} event - The event param.
   */
  onVRPoseChanged(event) {
    console.warn('Implement me')
  }
}

export default BaseTool
export { BaseTool }
