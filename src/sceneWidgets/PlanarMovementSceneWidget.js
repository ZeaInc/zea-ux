import SceneWidget  from './SceneWidget.js';

export default class PlanarMovementSceneWidget extends SceneWidget {
  constructor(name) {
    super(name)
  }

  getManipulationPlane(viewport) {
    return new Visualive.Ray(this.getGlobalXfo().tr, this.getGlobalXfo().ori.getZaxis());
  }


  onDragStart(event, grabPos) {
    this.manipulateBegin.emit({
      grabPos,
      manipRay: this.manipRay,
      grabPos
    });
  }

  onDrag(event, holdPos) {
    const dragDist = this.sliderRay.dir.dot(holdPos.subtract(this.sliderRay.pos));
    const delta = (dragDist - this.mouseDownDist);
    this.manipulate.emit({
      holdPos,
      manipRay: this.manipRay,
      vec: this.manipRay.dir.scale(delta),
      value: dragDist,
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

}