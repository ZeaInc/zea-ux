

// A SceneWidget is a UI widget that lives in the scene. 
// Much like a slider, it translates a series of 
// mouse events into a higher level interaction.
export default class SceneWidget extends Visualive.TreeItem {
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

  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationRay();
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.grabPos = event.mouseRay.pointAtDist(dist);
    this.onDragStart(event);
    return true;
  }

  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.holdPos = event.mouseRay.pointAtDist(dist);
    this.onDrag(event);
  }

  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayPlane(this.gizmoRay);
    event.releasePos = event.mouseRay.pointAtDist(dist);
    this.onDragEnd(event);
    return true;
  }

  /////////////////////////////////////
  // VRController events

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

  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo()
    this.onDrag(event, xfo.tr);
    return true;
  }

  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      const xfo = this.activeController.getTipXfo()
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
