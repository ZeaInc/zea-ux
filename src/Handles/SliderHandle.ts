import {
  Color,
  Xfo,
  NumberParameter,
  GeomItem,
  Material,
  Cylinder,
  Sphere,
  Registry,
  MathFunctions,
  Parameter,
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
  XRControllerEvent,
} from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'

/**
 * Class representing a slider scene widget. There are two parts in this widget, the slider and the handle.<br>
 * The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.
 *
 * **Parameters**
 * * **Length(`NumberParameter`):** Specifies the length of the slider.
 * * **HandleRadius(`NumberParameter`):** Specifies the handle radius.
 * * **BarRadius(`NumberParameter`):** Specifies the radius of the slider.
 *
 *
 * @extends BaseLinearMovementHandle
 */
class SliderHandle extends BaseLinearMovementHandle {
  param: Parameter<unknown>
  lengthParam: NumberParameter
  barRadiusParam: NumberParameter
  handleRadiusParam: NumberParameter
  handleMat: Material
  handle: GeomItem
  baseBar: GeomItem
  topBar: GeomItem
  handleXfo = new Xfo()
  baseBarXfo = new Xfo()
  topBarXfo = new Xfo()
  change: ParameterValueChange
  /**
   * Create a slider scene widget.
   *
   * @param {string} name - The name value.
   * @param {number} length - The length value.
   * @param {number} radius - The radius value.
   * @param {Color} color - The color value.
   */
  constructor(name?: string, length = 0.5, radius = 0.02, color = new Color('#F9CE03')) {
    super(name)

    this.lengthParam = new NumberParameter('Length', length)
    this.handleRadiusParam = new NumberParameter('HandleRadius', radius)
    this.barRadiusParam = new NumberParameter('BarRadius', radius * 0.25)
    this.addParameter(this.lengthParam)
    this.addParameter(this.handleRadiusParam)
    this.addParameter(this.barRadiusParam)
    this.colorParam.value = color

    this.handleMat = new Material('handle', 'FlatSurfaceShader')
    this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()

    const topBarMat = new Material('topBar', 'FlatSurfaceShader')
    topBarMat.getParameter('BaseColor').value = new Color(0.5, 0.5, 0.5)

    const barGeom = new Cylinder(radius * 0.25, 1, 64, 2, true, true)
    const handleGeom = new Sphere(radius, 64)

    this.handle = new GeomItem('handle', handleGeom, this.handleMat)
    this.baseBar = new GeomItem('baseBar', barGeom, this.handleMat)
    this.topBar = new GeomItem('topBar', barGeom, topBarMat)

    this.barRadiusParam.on('valueChanged', () => {
      barGeom.radiusParam.value = this.barRadiusParam.getValue()
    })
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom.radiusParam.value = this.handleRadiusParam.getValue()
    })
    this.lengthParam.on('valueChanged', () => {
      this.__updateSlider(this.value)
    })
    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
    })

    this.addChild(this.handle)
    this.addChild(this.baseBar)
    this.addChild(this.topBar)

    this.__updateSlider(0)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    super.highlight()
    this.handleMat.getParameter('BaseColor').value = this.highlightColorParam.getValue()
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    super.unhighlight()
    this.handleMat.getParameter('BaseColor').value = this.colorParam.getValue()
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param: Parameter<unknown>) {
    this.param = param
    const __updateSlider = () => {
      this.__updateSlider(param.getValue())
    }
    __updateSlider()
    param.on('valueChanged', __updateSlider)
  }

  /**
   *
   *
   * @param {*} value -
   * @private
   */
  __updateSlider(value: any) {
    this.value = value
    const param = <NumberParameter>this.param
    const range = param && param.getRange() ? param.getRange() : [0, 1]
    const v = MathFunctions.remap(value, range[0], range[1], 0, 1)
    const length = this.lengthParam.getValue()
    this.baseBarXfo.sc.z = v * length
    this.handleXfo.tr.z = v * length
    this.topBarXfo.tr.z = v * length
    this.topBarXfo.sc.z = (1 - v) * length
    this.handle.localXfoParam.value = this.handleXfo
    this.baseBar.localXfoParam.value = this.baseBarXfo
    this.topBar.localXfoParam.value = this.topBarXfo
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event: ZeaPointerEvent) {
    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.2
    this.handle.localXfoParam.value = this.handleXfo
    if (!this.param) {
      return
    }

    this.change = new ParameterValueChange(this.param)
    UndoRedoManager.getInstance().addChange(this.change)
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event: ZeaPointerEvent) {
    const length = this.lengthParam.getValue()
    const param = <NumberParameter>this.param
    const range = param && param.getRange() ? param.getRange() : [0, 1]
    const value = MathFunctions.clamp(
      MathFunctions.remap(this.value as number, 0, length, range[0], range[1]), // NOTE: assumes this.value is a number
      range[0],
      range[1]
    )
    if (!this.param) {
      this.__updateSlider(value)
      this.value = value
      return
    }

    this.change.update({
      value,
    })
  }

  /**
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent) {
    this.change = null
    // unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0
    this.handle.localXfoParam.value = this.handleXfo
  }

  /**
   * Serializes handle item as a JSON object.
   *
   * @param {object} context - The context param.
   * @return {object} The return value.
   */
  toJSON(context: Record<string, any>) {
    const json = super.toJSON(context)
    if (this.param) json.targetParam = this.param.getPath()
    return json
  }

  /**
   * Restores handle item from a JSON object.
   *
   * @param {object} json - The json param.
   * @param {object} context - The context param.
   */
  fromJSON(json: Record<string, any>, context: Record<string, any>) {
    super.fromJSON(json, context)

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param: any) => {
        this.setTargetParam(param)
      })
    }
  }
}

Registry.register('SliderHandle', SliderHandle)

export default SliderHandle
export { SliderHandle }
