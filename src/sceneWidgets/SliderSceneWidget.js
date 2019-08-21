import { BaseLinearMovementSceneWidget } from './BaseLinearMovementSceneWidget.js';

import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a slider scene widget.
 * @extends BaseLinearMovementSceneWidget
 */
class SliderSceneWidget extends BaseLinearMovementSceneWidget {
  /**
   * Create a slider scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} radius - The radius value.
   * @param {any} color - The color value.
   */
  constructor(
    name,
    length = 0.5,
    radius = 0.02,
    color = new Visualive.Color(1, 1, 0)
  ) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new Visualive.Color(1, 1, 1);

    this.lengthParam = this.addParameter(
      new Visualive.NumberParameter('length', length)
    );
    this.radiusParam = this.addParameter(
      new Visualive.NumberParameter('radius', radius)
    );
    this.colorParam = this.addParameter(
      new Visualive.ColorParameter('BaseColor', color)
    );

    const handleMat = new Visualive.Material('handle', 'FlatSurfaceShader');
    handleMat.replaceParameter(this.colorParam);
    // const baseBarMat = new Visualive.Material('baseBar', 'FlatSurfaceShader');
    // baseBarMat.replaceParameter(this.colorParam);
    const topBarMat = new Visualive.Material('topBar', 'FlatSurfaceShader');
    topBarMat
      .getParameter('BaseColor')
      .setValue(new Visualive.Color(0.5, 0.5, 0.5));

    const barGeom = new Visualive.Cylinder(radius * 0.25, 1, 64, 2, true, true);
    const handleGeom = new Visualive.Sphere(radius, 64);

    this.handle = new Visualive.GeomItem('handle', handleGeom, handleMat);
    this.baseBar = new Visualive.GeomItem('baseBar', barGeom, handleMat);
    this.topBar = new Visualive.GeomItem('topBar', barGeom, topBarMat);
    this.handleXfo = new Visualive.Xfo();
    this.baseBarXfo = new Visualive.Xfo();
    this.topBarXfo = new Visualive.Xfo();

    this.radiusParam.valueChanged.connect(() => {
      radius = this.radiusParam.getValue();
      barGeom.getParameter('radius').setValue(radius * 0.25);
      handleGeom.getParameter('radius').setValue(radius);
    });

    this.addChild(this.handle);
    this.addChild(this.baseBar);
    this.addChild(this.topBar);

    this.__updateSlider(0);
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
   */
  setTargetParam(param) {
    this.__param = param;
    const range = param.getRange() ? param.getRange() : [0, 1];
    const __updateSlider = () => {
      this.__updateSlider(
        Math.remap(param.getValue(), range[0], range[1], 0, 1)
      );
    };
    __updateSlider();
    param.valueChanged.connect(__updateSlider);
  }

  // eslint-disable-next-line require-jsdoc
  __updateSlider(value) {
    const length = this.lengthParam.getValue();
    this.baseBarXfo.sc.z = value * length;
    this.handleXfo.tr.z = value * length;
    this.topBarXfo.tr.z = value * length;
    this.topBarXfo.sc.z = (1 - value) * length;
    this.handle.setLocalXfo(this.handleXfo);
    this.baseBar.setLocalXfo(this.baseBarXfo);
    this.topBar.setLocalXfo(this.topBarXfo);
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.change = new ParameterValueChange(this.__param);
    event.undoRedoManager.addChange(this.change);

    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.5;
    this.handle.setLocalXfo(this.handleXfo);
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const length = this.lengthParam.getValue();
    const range =
      this.__param && this.__param.getRange()
        ? this.__param.getRange()
        : [0, 1];
    const value = Math.remap(event.value, 0, length, range[0], range[1]);
    this.change.update({
      value,
    });
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
    // /unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0;
    this.handle.setLocalXfo(this.handleXfo);
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} The return value.
   */
  toJSON(context, flags = 0) {
    const json = super.toJSON(
      context,
      flags | Visualive.SAVE_FLAG_SKIP_CHILDREN
    );
    json.targetParam = this.__param.getPath();
    return json;
  }

  /**
   * The fromJSON method.
   * @param {any} json - The json param.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   */
  fromJSON(json, context, flags) {
    super.fromJSON(json, context, flags);

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then(param => {
        this.setTargetParam(param);
      });
    }
  }
}

Visualive.sgFactory.registerClass('SliderSceneWidget', SliderSceneWidget);

export { SliderSceneWidget };
