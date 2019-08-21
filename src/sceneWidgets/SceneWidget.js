// A SceneWidget is a UI widget that lives in the scene.
// Much like a slider, it translates a series of
// mouse events into a higher level interaction.

/** Class representing a scene widget.
 * @extends Visualive.TreeItem
 */
export default class SceneWidget extends Visualive.TreeItem {
  /**
   * Create a scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
    this.manipulateBegin = new Visualive.Signal();
    this.manipulate = new Visualive.Signal();
    this.manipulateEnd = new Visualive.Signal();
  }

  /**
   * The highlight method.
   */
  highlight() {}

  /**
   * The unhighlight method.
   */
  unhighlight() {}

  /**
   * The getManipulationRay method.
   * @param {any} viewport - The viewport param.
   * @return {any} The return value.
   */
  getManipulationRay(viewport) {
    const xfo = this.getGlobalXfo();
    return new Visualive.Ray(xfo.tr, xfo.ori.getZaxis());
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationRay();
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.grabPos = event.mouseRay.pointAtDist(dist);
    this.onDragStart(event);
    return true;
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.holdPos = event.mouseRay.pointAtDist(dist);
    this.onDrag(event);
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.releasePos = event.mouseRay.pointAtDist(dist);
    this.onDragEnd(event);
    return true;
  }

  // ///////////////////////////////////
  // VRController events

  /**
   * The onVRControllerButtonDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonDown(event) {
    const gizmoRay = this.getManipulationRay();
    const grabDist = event.controllerRay.intersectRayVector(gizmoRay);
    if (grabDist > 0) {
      const grabPos = event.controllerRay.pointAtDist(grabDist);
      this.activeController = event.controller;
      this.onDragStart(event, grabPos);
      return true;
    }
  }

  /**
   * The onVRPoseChanged method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo();
    this.onDrag(event, xfo.tr);
    return true;
  }

  /**
   * The onVRControllerButtonUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTipXfo();
      this.onDragEnd(event, xfo.tr);
      this.activeController = undefined;
      return true;
    }
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    console.log('onDragStart', event);
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    console.log('onDrag', event);
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    console.log('onDragEnd', event);
  }
}
