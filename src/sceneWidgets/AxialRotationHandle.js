import Handle from './Handle.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/**
 * Class representing an axial rotation scene widget.
 * @extends Handle
 */
class AxialRotationHandle extends Handle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, radius, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new ZeaEngine.Color(1, 1, 1);
    this.radiusParam = this.addParameter(
      new ZeaEngine.NumberParameter('radius', radius)
    );
    this.colorParam = this.addParameter(
      new ZeaEngine.ColorParameter('BaseColor', color)
    );

    const handleMat = new ZeaEngine.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);

    // const handleGeom = new ZeaEngine.Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new ZeaEngine.Torus(thickness, radius, 64);
    this.handle = new ZeaEngine.GeomItem('handle', handleGeom, handleMat);
    this.handleXfo = new ZeaEngine.Xfo();

    this.radiusParam.valueChanged.connect(() => {
      radius = this.radiusParam.getValue();
      handleGeom.getParameter('radius').setValue(radius);
      handleGeom.getParameter('height').setValue(radius * 0.02);
    });

    this.addChild(this.handle);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
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

    this.baseXfo = this.getGlobalXfo();
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

    // Hilight the material.
    this.colorParam.setValue(new ZeaEngine.Color(1, 1, 1));
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

    if (event.shiftKey) {
      // modulat the angle to 5 degree increments.
      const increment = Math.degToRad(5);
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

    this.colorParam.setValue(this.__color);
  }
}
export { AxialRotationHandle };
