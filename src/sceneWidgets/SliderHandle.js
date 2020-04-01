import {
  Color,
  Xfo,
  NumberParameter,
  ColorParameter,
  ValueSetMode,
  GeomItem,
  Material,
  Cylinder,
  Sphere,
  SAVE_FLAG_SKIP_CHILDREN,
  sgFactory,
} from '@zeainc/zea-engine'

import { BaseLinearMovementHandle } from './BaseLinearMovementHandle.js'
import ParameterValueChange from '../undoredo/ParameterValueChange.js'

/** Class representing a slider scene widget.
 * @extends BaseLinearMovementHandle
 */
class SliderHandle extends BaseLinearMovementHandle {
  /**
   * Create a slider scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} radius - The radius value.
   * @param {any} color - The color value.
   */
  constructor(name, length = 0.5, radius = 0.02, color = new Color(1, 1, 0)) {
    super(name)

    this.lengthParam = this.addParameter(new NumberParameter('Length', length))
    this.handleRadiusParam = this.addParameter(
      new NumberParameter('Handle Radius', radius)
    )
    this.barRadiusParam = this.addParameter(
      new NumberParameter('Bar Radius', radius * 0.25)
    )
    this.colorParam = this.addParameter(new ColorParameter('Color', color))
    this.hilghlightColorParam = this.addParameter(
      new ColorParameter('Highlight Color', new Color(1, 1, 1))
    )

    this.handleMat = new Material('handle', 'FlatSurfaceShader')
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.colorParam.getValue())
    // const baseBarMat = new Material('baseBar', 'FlatSurfaceShader');
    // baseBarMat.replaceParameter(this.colorParam);
    const topBarMat = new Material('topBar', 'FlatSurfaceShader')
    topBarMat.getParameter('BaseColor').setValue(new Color(0.5, 0.5, 0.5))

    const barGeom = new Cylinder(radius * 0.25, 1, 64, 2, true, true)
    const handleGeom = new Sphere(radius, 64)

    this.handle = new GeomItem('handle', handleGeom, this.handleMat)
    this.baseBar = new GeomItem('baseBar', barGeom, this.handleMat)
    this.topBar = new GeomItem('topBar', barGeom, topBarMat)
    this.handleXfo = new Xfo()
    this.baseBarXfo = new Xfo()
    this.topBarXfo = new Xfo()

    this.barRadiusParam.valueChanged.connect(() => {
      barGeom.getParameter('radius').setValue(this.barRadiusParam.getValue())
    })
    this.handleRadiusParam.valueChanged.connect(() => {
      handleGeom
        .getParameter('radius')
        .setValue(this.handleRadiusParam.getValue())
    })
    this.lengthParam.valueChanged.connect(() => {
      this.__updateSlider(this.value)
    })
    this.colorParam.valueChanged.connect(() => {
      this.handleMat
        .getParameter('BaseColor')
        .setValue(this.colorParam.getValue())
    })

    this.addChild(this.handle)
    this.addChild(this.baseBar)
    this.addChild(this.topBar)

    this.__updateSlider(0)
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.hilghlightColorParam.getValue())
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.handleMat
      .getParameter('BaseColor')
      .setValue(this.colorParam.getValue())
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   */
  setTargetParam(param) {
    this.param = param
    const __updateSlider = () => {
      this.__updateSlider(param.getValue())
    }
    __updateSlider()
    param.valueChanged.connect(__updateSlider)
  }

  // eslint-disable-next-line require-jsdoc
  __updateSlider(value) {
    this.value = value
    const range =
      this.param && this.param.getRange() ? this.param.getRange() : [0, 1]
    const v = Math.remap(value, range[0], range[1], 0, 1)
    const length = this.lengthParam.getValue()
    this.baseBarXfo.sc.z = v * length
    this.handleXfo.tr.z = v * length
    this.topBarXfo.tr.z = v * length
    this.topBarXfo.sc.z = (1 - v) * length
    this.handle.setLocalXfo(this.handleXfo, ValueSetMode.GENERATED_VALUE)
    this.baseBar.setLocalXfo(this.baseBarXfo, ValueSetMode.GENERATED_VALUE)
    this.topBar.setLocalXfo(this.topBarXfo, ValueSetMode.GENERATED_VALUE)
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.2
    this.handle.setLocalXfo(this.handleXfo, ValueSetMode.GENERATED_VALUE)
    if (!this.param) {
      return
    }
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(this.param)
      event.undoRedoManager.addChange(this.change)
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const length = this.lengthParam.getValue()
    const range =
      this.param && this.param.getRange() ? this.param.getRange() : [0, 1]
    const value = Math.clamp(
      Math.remap(event.value, 0, length, range[0], range[1]),
      range[0],
      range[1]
    )
    if (!this.param) {
      this.__updateSlider(value)
      this.value = value
      return
    }
    if (this.change) {
      this.change.update({
        value,
      })
    } else {
      this.param.setValue(value)
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
    // unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0
    this.handle.setLocalXfo(this.handleXfo, ValueSetMode.GENERATED_VALUE)
  }

  /**
   * The toJSON method.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   * @return {any} The return value.
   */
  toJSON(context, flags = 0) {
    const json = super.toJSON(context, flags | SAVE_FLAG_SKIP_CHILDREN)
    if (this.param) json.targetParam = this.param.getPath()
    return json
  }

  /**
   * The fromJSON method.
   * @param {any} json - The json param.
   * @param {any} context - The context param.
   * @param {any} flags - The flags param.
   */
  fromJSON(json, context, flags) {
    super.fromJSON(json, context, flags)

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param) => {
        this.setTargetParam(param)
      })
    }
  }
}

sgFactory.registerClass('SliderHandle', SliderHandle)

export { SliderHandle }
