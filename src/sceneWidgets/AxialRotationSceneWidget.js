import SceneWidget from './SceneWidget.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

class AxialRotationSceneWidget extends SceneWidget {
  constructor(name, radius, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Visualive.Color(1, 1, 1);
    this.radiusParam = this.addParameter(
      new Visualive.NumberParameter('radius', radius)
    );
    this.colorParam = this.addParameter(
      new Visualive.ColorParameter('BaseColor', color)
    );

    const handleMat = new Visualive.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);

    // const handleGeom = new Visualive.Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Visualive.Torus(thickness, radius, 64);
    this.handle = new Visualive.GeomItem('handle', handleGeom, handleMat);
    this.handleXfo = new Visualive.Xfo();

    this.radiusParam.valueChanged.connect(() => {
      radius = this.radiusParam.getValue();
      handleGeom.getParameter('radius').setValue(radius);
      handleGeom.getParameter('height').setValue(radius * 0.02);
    });

    this.addChild(this.handle);
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
    this.vec0 = event.grabPos.subtract(this.getGlobalXfo().tr);
    this.grabPos = event.grabPos;
    this.change = new ParameterValueChange(this.__param);

    event.undoRedoManager.addChange(this.change);

    this.baseXfo = this.getGlobalXfo();
    this.deltaXfo = new Visualive.Xfo();
    this.offsetXfo = this.baseXfo.inverse().multiply(this.__param.getValue());

    // Hilight the material.
    this.colorParam.setValue(new Visualive.Color(1, 1, 1));

    this.manipulateBegin.emit({
      grabPos: event.grabPos,
      manipRay: this.manipRay,
    });
  }

  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);
    let angle = dragVec.length() * 2.0;

    const vec1 = event.holdPos.subtract(this.getGlobalXfo().tr);
    if (this.vec0.cross(vec1).dot(this.getGlobalXfo().ori.getZaxis()) < 0)
      angle = -angle;

    this.deltaXfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 0, 1), angle);

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
