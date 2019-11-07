import Handle from './Handle.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/**
 * Class representing an axial rotation scene widget.
 * @extends Handle
 */
class BaseAxialRotationHandle extends Handle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.setGlobalXfo(param.getValue());
      };
      __updateGizmo();
      param.valueChanged.connect(__updateGizmo);
    }
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {

    this.baseXfo = this.getGlobalXfo().clone();
    this.baseXfo.sc.set(1, 1, 1);
    this.deltaXfo = new ZeaEngine.Xfo();
    this.offsetXfo = this.baseXfo.inverse().multiply(this.param.getValue());
    
    this.vec0 = event.grabPos.subtract(this.baseXfo.tr);
    this.grabCircleRadius = this.vec0.length();
    this.vec0.normalizeInPlace();

    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(this.param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr);
    const dragCircleRadius = vec1.length();
    vec1.normalizeInPlace();

    // modulate the angle by the radius the mouse moves
    // away from the center of the handle.
    // This makes it possible to rotate the object more than
    // 180 degrees in a single movement.
    const modulator = dragCircleRadius / this.grabCircleRadius;
    let angle = this.vec0.angleTo(vec1) * modulator;
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0)
      angle = -angle;
    
    if (this.range) {
      angle = Math.clamp(angle, this.range[0], this.range[1]);
    }

    if (event.shiftKey) {
      // modulat the angle to X degree increments.
      const increment = Math.degToRad(22.5);
      angle = Math.floor(angle / increment) * increment;
    }

    this.deltaXfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 0, 1), angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo.multiply(this.offsetXfo);

    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      this.param.setValue(value);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }
}
export { BaseAxialRotationHandle };
