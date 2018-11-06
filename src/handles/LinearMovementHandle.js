import Handle  from './Handle.js';

export default class LinearMovementHandle extends Handle {
  constructor(name) {
    super(name)

  };

  /////////////////////////////////////
  // Mouse events

  handleMouseDown(event) {
    this.gizmoRay = this.getManipulationRay();
    this.grabDist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const grabPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(this.grabDist));
    this.onDragStart({});
    return true;
  }

  handleMouseMove(event) {
    const dist = event.mouseRay.intersectRayVector(this.gizmoRay)[1];
    const dragPos = this.gizmoRay.start.add(this.gizmoRay.dir.scale(dist));
    this.onDrag({ value: dist, delta: (dist-this.grabDist)  });
  }

  handleMouseUp(event) {
    this.onDragEnd({});
    return true;
  }


  /////////////////////////////////////
  // VRController events

  onVRControllerButtonDown(event) {
    this.gizmoRay = this.getManipulationRay();
    
    this.activeController = event.controller;
    const xfo = this.activeController.getTipXfo();
    this.grabDist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
    this.onDragStart();
    return true;
  }

  onVRPoseChanged(event) {
    const xfo = this.activeController.getTipXfo()
    const dist = xfo.tr.subtract(this.gizmoRay.start).dot(this.gizmoRay.dir);
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
