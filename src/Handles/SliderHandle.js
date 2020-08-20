import {
  Color,
  Xfo,
  NumberParameter,
  ColorParameter,
  GeomItem,
  Material,
  Cylinder,
  Sphere,
  Registry,
  MathFunctions,
} from '@zeainc/zea-engine'
import BaseLinearMovementHandle from './BaseLinearMovementHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'

/**
 * Class representing a slider scene widget.
 *
 * @extends BaseLinearMovementHandle
 */
class SliderHandle extends BaseLinearMovementHandle {
  /**
   * Create a slider scene widget.
   *
   * @param {string} name - The name value.
   * @param {number} length - The length value.
   * @param {number} radius - The radius value.
   * @param {Color} color - The color value.
   */
  constructor(name, length = 0.5, radius = 0.02, color = new Color('#F9CE03')) {
    super(name)

    this.lengthParam = this.addParameter(new NumberParameter('Length', length))
    this.handleRadiusParam = this.addParameter(new NumberParameter('Handle Radius', radius))
    this.barRadiusParam = this.addParameter(new NumberParameter('Bar Radius', radius * 0.25))
    this.colorParam = this.addParameter(new ColorParameter('Color', color))
    this.hilghlightColorParam = this.addParameter(new ColorParameter('Highlight Color', new Color(1, 1, 1)))

    this.handleMat = new Material('handle', 'FlatSurfaceShader')
    this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
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

    this.barRadiusParam.on('valueChanged', () => {
      barGeom.getParameter('radius').setValue(this.barRadiusParam.getValue())
    })
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom.getParameter('radius').setValue(this.handleRadiusParam.getValue())
    })
    this.lengthParam.on('valueChanged', () => {
      this.__updateSlider(this.value)
    })
    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
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
    this.handleMat.getParameter('BaseColor').setValue(this.hilghlightColorParam.getValue())
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param) {
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
  __updateSlider(value) {
    this.value = value
    const range = this.param && this.param.getRange() ? this.param.getRange() : [0, 1]
    const v = MathFunctions.remap(value, range[0], range[1], 0, 1)
    const length = this.lengthParam.getValue()
    this.baseBarXfo.sc.z = v * length
    this.handleXfo.tr.z = v * length
    this.topBarXfo.tr.z = v * length
    this.topBarXfo.sc.z = (1 - v) * length
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo)
    this.baseBar.getParameter('LocalXfo').setValue(this.baseBarXfo)
    this.topBar.getParameter('LocalXfo').setValue(this.topBarXfo)
  }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Handles the initially drag of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    // Hilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.2
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo)
    if (!this.param) {
      return
    }
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(this.param)
      event.undoRedoManager.addChange(this.change)
    }
  }

  /**
   * Handles drag action of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    const length = this.lengthParam.getValue()
    const range = this.param && this.param.getRange() ? this.param.getRange() : [0, 1]
    const value = MathFunctions.clamp(
      MathFunctions.remap(event.value, 0, length, range[0], range[1]),
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
   * Handles the end of dragging the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
    // unhilight the material.
    this.handleXfo.sc.x = this.handleXfo.sc.y = this.handleXfo.sc.z = 1.0
    this.handle.getParameter('LocalXfo').setValue(this.handleXfo)
  }

  /**
   * Serializes handle item as a JSON object.
   *
   * @param {object} context - The context param.
   * @return {object} The return value.
   */
  toJSON(context) {
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
  fromJSON(json, context) {
    super.fromJSON(json, context)

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param) => {
        this.setTargetParam(param)
      })
    }
  }
}

Registry.register('SliderHandle', SliderHandle)

export default SliderHandle
export { SliderHandle }
