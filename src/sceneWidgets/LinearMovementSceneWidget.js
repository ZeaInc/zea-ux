import SceneWidget  from './SceneWidget.js';

class LinearMovementSceneWidget extends SceneWidget {
  constructor(name) {
    super(name)

  };


  /////////////////////////////////////
  // Mouse events

  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationRay();
    this.grabDist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const grabPos = this.gizmoRay.pointAtDist(this.grabDist);
    event.grabPos = grabPos;
    this.onDragStart(event);
    return true;
  }

  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const holdPos = this.gizmoRay.pointAtDist(dist);
    event.holdPos = holdPos;
    event.value = dist;
    event.delta = dist-this.grabDist;
    this.onDrag(event);
  }

  handleMouseUp(event) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const releasePos = this.gizmoRay.pointAtDist(dist);
    event.releasePos = releasePos;
    this.onDragEnd(event);
    return true;
  }

  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    this.gizmoRay = this.getManipulationRay();
    
    this.activeController = event.controller;
    const xfo = this.activeController.getTipXfo();
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
    this.onDragStart(event);
    return true;
  }

  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo()
    const dist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
    const holdPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist));
    event.value = dist;
    event.delta = dist-this.grabDist;
    this.onDrag(event);
    return true;
  }

  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTipXfo()
      this.onDragEnd();
      this.activeController = undefined;
      return true;
    }
  }
};

export {
  LinearMovementSceneWidget
}