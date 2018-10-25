import Gizmo  from './Gizmo.js';

export default class LinearMovementGizmo extends Gizmo {
  constructor(name) {
    super(name)

  };

  /////////////////////////////////////
  // Mouse events

  handleMouseDown(event, mousePos, viewport) {
    this.gizmoRay = this.getManipulationRay();
    this.grabDist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist));
    this.onDragStart({});
    return true;
  }

  handleMouseMove(event, mousePos, viewport) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const dragPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist));
    this.onDrag({ value: dist, delta: (dist-this.grabDist)  });
  }

  handleMouseUp(event, mousePos, viewport) {
    // const mouseRay = viewport.calcRayFromScreenPos(mousePos);
    // const dist = mouseRay.intersectRayVector(this.gizmoRay)[0];
    // const releasePos = mouseRay.dir.scale(dist);
    this.onDragEnd({});
    return true;
  }


  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    const gizmoRay = this.getManipulationRay();
    // const grabDist = event.controllerRay.intersectRayVector(gizmoRay)[1];
    // const grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist));
    
    this.activeController = event.controller;
    const xfo = this.activeController.getTipXfo();
    this.grabDist = xfo.tr.subtract(gizmoRay.start).dot(gizmoRay.dir);
    this.onDragStart();
    return true;
  }

  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo()
    const dist = xfo.tr.subtract(gizmoRay.start).dot(gizmoRay.dir);
    const dragPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist));
    this.onDrag({ value: dist, delta: (dist-this.grabDist)  });
    return true;
  }

  onVRControllerButtonUp(event) {
    if (this.activeController == event.controller) {
      // const xfo = this.activeController.getTiipXfo()
      this.onDragEnd();
      this.activeController = undefined;
      return true;
    }
  }
};
