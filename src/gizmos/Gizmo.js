

// A Gizmo is a UI widget that lives in the scene. 
// Much like a slider, it translates a series of 
// mouse events into a higher level interaction.
export default class Gizmo extends Visualive.TreeItem {
  constructor(name) {
    super(name)
    this.manipulateBegin = new Visualive.Signal();
    this.manipulate = new Visualive.Signal();
    this.manipulateEnd = new Visualive.Signal();
  }

  highlight() {}

  unhighlight() {}

  getManipulationRay(viewport){
    const xfo = this.getGlobalXfo();
    return new Visualive.Ray(xfo.tr, xfo.ori.getZaxis());
  }

  /////////////////////////////////////
  // Mouse events

  handleMouseDown(event, mousePos, viewport) {
    // 
    this.gizmoRay = this.getManipulationRay();
    const grabDist = event.intersectionData.mouseRay.intersectRayVector(this.gizmoRay);
    if (grabDist > 0) {
      const grabPos = event.intersectionData.mouseRay.dir.scale(grabDist);
      this.onDragStart(event, grabPos);
      return true;
    }
  }

  handleMouseMove(event, mousePos, viewport) {
    const mouseRay = viewport.calcRayFromScreenPos(mousePos);
    const dist = mouseRay.intersectRayVector(this.gizmoRay)[0];
    const dragPos = mouseRay.dir.scale(dist);
    this.onDragStart(event, dragPos);
  }

  handleMouseUp(event, mousePos, viewport) {
    const mouseRay = viewport.calcRayFromScreenPos(mousePos);
    const dist = mouseRay.intersectRayVector(this.gizmoRay)[0];
    const releasePos = mouseRay.dir.scale(dist);
    this.onDragEnd(event, releasePos);
    return true;
  }

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    const gizmoRay = this.getManipulationRay();
    const grabDist = event.controllerRay.intersectRayVector(gizmoRay);
    if (grabDist > 0) {
      const grabPos = event.controllerRay.dir.scale(grabDist);
      this.activeController = event.controller;
      this.onDragStart(event, grabPos);
      return true;
    }
  }

  onVRPoseChanged(event) {
    const xfo = this.activeController.getTiipXfo()
    this.onDrag(event, xfo.tr);
    return true;
  }

  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTiipXfo()
      this.onDragEnd(event, xfo.tr);
      this.activeController = undefined;
      return true;
    }
  }

  /////////////////////////////////////
  // Interaction events

  onDragStart(event) {
    console.log('onDragStart', event)
  }

  onDrag(event) {
    console.log('onDrag', event)
  }

  onDragEnd(event) {
    console.log('onDragEnd', event)
  }
};
