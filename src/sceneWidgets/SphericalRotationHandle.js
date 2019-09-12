import Handle from './Handle.js';
// import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/**
 * Class representing an axial rotation scene widget.
 * @extends Handle
 */
class SphericalRotationHandle extends Handle {
  /**
   * Create an axial rotation scene widget.
   * @param {any} name - The name value.
   * @param {any} radius - The radius value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, radius, color) {
    super(name);

    this.radius = radius;
    const maskMat = new ZeaEngine.Material('mask', 'HandleShader');
    maskMat.getParameter('BaseColor').setValue(color);
    const maskGeom = new ZeaEngine.Sphere(radius, 64);
    const maskGeomItem = new ZeaEngine.GeomItem('mask', maskGeom, maskMat);
    this.addChild(maskGeomItem);
  }

  /**
   * The highlight method.
   */
  highlight() {
    // this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    // this.colorParam.setValue(this.__color);
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

  // ///////////////////////////////////
  // Mouse events

  /**
   * The handleMouseDown method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseDown(event) {
    // const xfo = this.getGlobalXfo();
    // this.sphere = {
    //   tr: xfo,
    //   radius: this.radius,
    // };
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.grabPos = event.mouseRay.pointAtDist(dist);
    // this.onDragStart(event);
    return true;
  }

  /**
   * The handleMouseMove method.
   * @param {any} event - The event param.
   */
  handleMouseMove(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.holdPos = event.mouseRay.pointAtDist(dist);
    // this.onDrag(event);
    return true;
  }

  /**
   * The handleMouseUp method.
   * @param {any} event - The event param.
   * @return {any} The return value.
   */
  handleMouseUp(event) {
    // const dist = event.mouseRay.intersectRaySphere(this.sphere);
    // event.releasePos = event.mouseRay.pointAtDist(dist);
    // this.onDragEnd(event);
    return true;
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
    this.vec0.normalizeInPlace();

    // Hilight the material.
    this.colorParam.setValue(new ZeaEngine.Color(1, 1, 1));

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
    vec1.normalizeInPlace();

    const angle = this.vec0.angleTo(vec1) * modulator;
    const axis = this.vec0.cross(vec1).normalize();

    this.deltaXfo.ori.setFromAxisAndAngle(axis, angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo.multiply(this.offsetXfo);

    if (this.change) {
      this.change.update({
        value,
      });
    } else {
      this.param.setValue(newXfo);
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
export { SphericalRotationHandle };
