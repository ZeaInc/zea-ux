import SceneWidget  from './SceneWidget.js';

class AxialRotationSceneWidget extends SceneWidget {
  constructor(name) {
    super(name)
  }

  getManipulationPlane(viewport) {
    return new Visualive.Ray(this.getGlobalXfo().tr, this.getGlobalXfo().ori.getZaxis());
  }


  onDragStart(event, grabPos) {
    this.manipulateBegin.emit({
      grabPos,
      manipRay: this.manipRay
    });
  }

  onDrag(event, holdPos) {
    const dragVec = holdPos.subtract(holdPos.subtract(this.sliderRay.pos).dot(this.sliderRay.dir));
    const delta = dragVec.subtract(this.grabDist);
    this.manipulate.emit({
      holdPos,
      manipRay: this.manipRay,
      vec: this.manipRay.dir.scale(delta),
      value: dragVec,
      delta
    });
  }

  onDragEnd(event, releasePos) {
    this.manipulateEnd.emit({
      releasePos,
      manipRay: this.manipRay,
      delta
    });
  }

};
export {
  AxialRotationSceneWidget
}