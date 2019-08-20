import { BaseLinearMovementSceneWidget } from './BaseLinearMovementSceneWidget.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a linear scale scene widget.
 * @extends BaseLinearMovementSceneWidget
 */
class LinearScaleSceneWidget extends BaseLinearMovementSceneWidget {
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
    this.__hilightedColor = new Visualive.Color(1, 1, 1);
    this.colorParam = this.addParameter(
      new Visualive.ColorParameter('BaseColor', color)
    );

    const handleMat = new Visualive.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);
    const handleGeom = new Visualive.Cylinder(
      thickness,
      length - thickness * 10,
      64
    );
    handleGeom.getParameter('baseZAtZero').setValue(true);
    const tipGeom = new Visualive.Cuboid(
      thickness * 10,
      thickness * 10,
      thickness * 10
    );
    const handle = new Visualive.GeomItem('handle', handleGeom, handleMat);

    const tip = new Visualive.GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new Visualive.Xfo();
    tipXfo.tr.set(0, 0, length - thickness * 10);
    tipGeom.transformVertices(tipXfo);

    // this.radiusParam.valueChanged.connect(()=>{
    //   radius = this.radiusParam.getValue();
    //   handleGeom.getParameter('radius').setValue(radius);
    //   handleGeom.getParameter('height').setValue(radius * 0.02);
    // })

    this.addChild(handle);
    this.addChild(tip);
  }

  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  unhighlight() {
    this.colorParam.setValue(this.__color);
  }

  setTargetParam(param, track = true) {
    this.__param = param;
    if (track) {
      const __updateGizmo = () => {
        this.setGlobalXfo(param.getValue());
      };
      __updateGizmo();
      param.valueChanged.connect(__updateGizmo);
    }
  }

  onDragStart(event) {
    this.change = new ParameterValueChange(this.__param);
    event.undoRedoManager.addChange(this.change);

    this.grabDist = event.grabDist;
    console.log(this.grabDist);
    this.oriXfo = this.getGlobalXfo();
    this.baseXfo = this.__param.getValue();
    this.sc = (this.baseXfo.sc.x + this.baseXfo.sc.y + this.baseXfo.sc.z) / 3.0;

    this.manipulateBegin.emit({
      grabPos: event.grabPos,
      manipRay: this.manipRay,
    });
  }

  onDrag(event) {
    // const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    const sc = event.holdDist / this.grabDist;
    if (sc < 0.0001) return;
    // const scX = this.oriXfo.ori.getZaxis().dot(newXfo.ori.getXaxis());
    // const scY = this.oriXfo.ori.getZaxis().dot(newXfo.ori.getYaxis());
    // const scZ = this.oriXfo.ori.getZaxis().dot(newXfo.ori.getZaxis());
    // console.log("sc:", sc, " scX", scX, " scY:", scY, " scZ:", scZ)
    // newXfo.sc.set(scX, scY, scZ);
    newXfo.sc.set(this.sc * sc, this.sc * sc, this.sc * sc);

    this.change.update({
      value: newXfo,
    });

    this.manipulate.emit({
      holdPos: event.holdPos,
      manipRay: this.gizmoRay,
      deltaXfo: this.deltaXfo,
      newXfo: newXfo,
    });
  }

  onDragEnd(event) {
    this.change = null;

    this.manipulateEnd.emit({
      releasePos: event.releasePos,
      manipRay: this.manipRay,
    });
  }
}

export { LinearScaleSceneWidget };
