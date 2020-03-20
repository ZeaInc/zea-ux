
import {
  Color,
  Xfo,
  NumberParameter,
  ColorParameter,
  GeomItem,
  Material,
  Torus,
} from '@zeainc/zea-engine';

import { BaseAxialRotationHandle } from './BaseAxialRotationHandle.js';

/**
 * Class representing an axial rotation scene widget.
 * @extends BaseAxialRotationHandle
 */
class AxialRotationHandle extends BaseAxialRotationHandle {
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
    this.__hilightedColor = new Color(1, 1, 1);
    this.radiusParam = this.addParameter(
      new NumberParameter('radius', radius)
    );
    this.colorParam = this.addParameter(
      new ColorParameter('BaseColor', color)
    );

    const handleMat = new Material('handle', 'HandleShader');
    handleMat.getParameter("maintainScreenSize").setValue(true)
    handleMat.replaceParameter(this.colorParam);

    // const handleGeom = new Cylinder(radius, thickness * 2, 64, 2, false);
    const handleGeom = new Torus(thickness, radius, 64);
    this.handle = new GeomItem('handle', handleGeom, handleMat);
    this.handleXfo = new Xfo();

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
   * The getBaseXfo method.
   */
  getBaseXfo() {
    return this.getParameter('GlobalXfo').getValue();
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    super.onDragStart(event);

    // Hilight the material.
    this.colorParam.setValue(new Color(1, 1, 1));
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    super.onDrag(event);
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    super.onDragEnd(event);
    this.colorParam.setValue(this.__color);
  }
}
export { AxialRotationHandle };
