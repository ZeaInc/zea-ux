import SceneWidget from './SceneWidget.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/**
 * Class representing an axial rotation scene widget.
 * @extends SceneWidget
 */
class AxialRotationSceneWidget extends SceneWidget {
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
    this.__param = param;
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
    this.vec0 = event.grabPos.subtract(this.getGlobalXfo().tr);
    this.grabPos = event.grabPos;
    this.change = new ParameterValueChange(this.__param);

    event.undoRedoManager.addChange(this.change);

    this.baseXfo = this.getGlobalXfo();
    this.baseXfo.sc.set(1, 1, 1);
    this.deltaXfo = new ZeaEngine.Xfo();
    this.offsetXfo = this.baseXfo.inverse().multiply(this.__param.getValue());

    // Hilight the material.
    this.colorParam.setValue(new ZeaEngine.Color(1, 1, 1));

    this.manipulateBegin.emit({
      grabPos: event.grabPos,
      manipRay: this.manipRay,
    });
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);
    let angle = dragVec.length() * 2.0;

    const vec1 = event.holdPos.subtract(this.baseXfo.tr);
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0)
      angle = -angle;

    this.deltaXfo.ori.setFromAxisAndAngle(new ZeaEngine.Vec3(0, 0, 1), angle);

    const newXfo = this.baseXfo.multiply(this.deltaXfo);
    const value = newXfo.multiply(this.offsetXfo);

    // this.__param.setValue(newXfo)

    this.change.update({
      value,
    });

    this.manipulate.emit({
      holdPos: event.holdPos,
      manipRay: this.gizmoRay,
      angle,
      deltaXfo: this.deltaXfo,
      newXfo: value,
    });
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;

    this.colorParam.setValue(this.__color);

    this.manipulateEnd.emit({
      releasePos: event.releasePos,
      manipRay: this.manipRay,
    });
  }
}
export { AxialRotationSceneWidget };
