import { BaseLinearMovementHandle } from './BaseLinearMovementHandle.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a linear scale scene widget.
 * @extends BaseLinearMovementHandle
 */
class LinearScaleHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear scale scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, length, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new ZeaEngine.Color(1, 1, 1);
    this.colorParam = this.addParameter(
      new ZeaEngine.ColorParameter('BaseColor', color)
    );

    const handleMat = new ZeaEngine.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);
    const handleGeom = new ZeaEngine.Cylinder(
      thickness,
      length - thickness * 10,
      64
    );
    handleGeom.getParameter('baseZAtZero').setValue(true);
    const tipGeom = new ZeaEngine.Cuboid(
      thickness * 10,
      thickness * 10,
      thickness * 10
    );
    const handle = new ZeaEngine.GeomItem('handle', handleGeom, handleMat);

    const tip = new ZeaEngine.GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new ZeaEngine.Xfo();
    tipXfo.tr.set(0, 0, length - thickness * 10);
    // tipXfo.tr.set(0, 0, length);
    // tip.setLocalXfo(tipXfo);
    // Note: the constant screen size shader
    // only works if all the handle geometries
    // are centered on the middle of the XfoHandle. 
    tipGeom.transformVertices(tipXfo);

    this.addChild(handle);
    this.addChild(tip);
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
    this.change = new ParameterValueChange(this.param);
    event.undoRedoManager.addChange(this.change);

    this.grabDist = event.grabDist;
    console.log(this.grabDist);
    this.oriXfo = this.getGlobalXfo();
    this.tmplocalXfo = this.getLocalXfo();
    this.baseXfo = this.param.getValue();
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    // const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    const sc = event.holdDist / this.grabDist;
    if (sc < 0.0001) return;

    // const scAxis = this.oriXfo.ori.getZaxis();
    // const scX = this.baseXfo.ori.getXaxis().dot(scAxis);
    // const scY = this.baseXfo.ori.getYaxis().dot(scAxis);
    // const scZ = this.baseXfo.ori.getZaxis().dot(scAxis);
    // console.log("sc:", sc, " scX", scX, " scY:", scY, " scZ:", scZ)
    // newXfo.sc.set(scX, scY, scZ);
    newXfo.sc.set(
      this.baseXfo.sc.x * sc,
      this.baseXfo.sc.y * sc,
      this.baseXfo.sc.z * sc
    );

    // Scale inheritance is disabled for handles.
    // (XfoHandle throws away scale in _cleanGlobalXfo).
    // This means we have to apply it here to see the scale  
    // widget change size.
    this.tmplocalXfo.sc.set(1, 1, sc);
    this.setLocalXfo(this.tmplocalXfo);

    this.change.update({
      value: newXfo,
    });
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;

    this.tmplocalXfo.sc.set(1, 1, 1);
    this.setLocalXfo(this.tmplocalXfo);

    const tip = this.getChildByName('tip');
    const tipXfo = tip.getLocalXfo();
    tipXfo.sc.set(1, 1, 1);
    tip.setLocalXfo(tipXfo);
  }
}

export { LinearScaleHandle };
