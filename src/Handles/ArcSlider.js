import {
  MathFunctions,
  Color,
  Vec3,
  Xfo,
  NumberParameter,
  XfoParameter,
  GeomItem,
  Material,
  Circle,
  Sphere,
  Registry,
} from '@zeainc/zea-engine'
import { BaseAxialRotationHandle } from './BaseAxialRotationHandle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'

/**
 * Class representing a slider scene widget with an arc shape. There are two parts in this widget, the slider and the handle.<br>
 * The **Handle** is the moving part of the widget, the object you interact with. The **Slider** is the path that the **handle** follows.
 *
 *
 * **Parameters**
 * * **ArcRadius(`NumberParameter`):** Specifies the radius of the slider.
 * * **ArcAngle(`NumberParameter`):** Specifies the arc angle of the slider.
 * * **HandleRadius(`NumberParameter`):** Specifies the radius of the handle in the slider.
 *
 * **Events**
 * * **dragStart:** Triggered when the pointer is down.
 * * **dragEnd:** Triggered when the pointer is released.
 *
 * @extends BaseAxialRotationHandle
 */
class ArcSlider extends BaseAxialRotationHandle {
  /**
   * Creates an instance of ArcSlider.
   *
   * @param {string} name - The name value
   * @param {number} [arcRadius=1] - The arcRadius value
   * @param {number} [arcAngle=1] - The arcAngle value
   * @param {number} [handleRadius=0.02] - The handleRadius value
   * @param {Color} [color=new Color(1, 1, 0)] - the color value
   */
  constructor(name, arcRadius = 1, arcAngle = 1, handleRadius = 0.02, color = new Color(1, 1, 0)) {
    super(name)
    this.arcRadiusParam = this.addParameter(new NumberParameter('ArcRadius', arcRadius))
    this.arcAngleParam = this.addParameter(new NumberParameter('ArcAngle', arcAngle))
    this.handleRadiusParam = this.addParameter(new NumberParameter('HandleRadius', handleRadius))
    // this.barRadiusParam = this.addParameter(
    //   new NumberParameter('Bar Radius', radius * 0.25)
    // );
    this.colorParam.setValue(color)

    this.handleMat = new Material('handleMat', 'HandleShader')
    this.handleMat.getParameter('BaseColor').setValue(color)

    const arcGeom = new Circle(arcRadius, 64, arcAngle)
    const handleGeom = new Sphere(handleRadius, 64)

    this.handle = new GeomItem('handle', handleGeom, this.handleMat)
    this.arc = new GeomItem('arc', arcGeom, this.handleMat)
    this.handleXfo = new Xfo()
    this.handleGeomOffsetXfo = new Xfo()
    this.handleGeomOffsetXfo.tr.x = arcRadius
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo)

    // this.barRadiusParam.on('valueChanged', () => {
    //   arcGeom.getParameter('Radius').setValue(this.barRadiusParam.getValue());
    // });

    this.range = [0, arcAngle]
    this.arcAngleParam.on('valueChanged', () => {
      const arcAngle = this.arcAngleParam.getValue()
      arcGeom.getParameter('Angle').setValue(arcAngle)
      this.range = [0, arcAngle]
    })
    this.arcRadiusParam.on('valueChanged', () => {
      const arcRadius = this.arcRadiusParam.getValue()
      arcGeom.getParameter('Radius').setValue(arcRadius)
      this.handleGeomOffsetXfo.tr.x = arcRadius
      this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo)
    })
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom.getParameter('Radius').setValue(this.handleRadiusParam.getValue())
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
    })

    this.addChild(this.handle)
    this.addChild(this.arc)

    // this.__updateSlider(0);
    this.setTargetParam(this.handle.getParameter('GlobalXfo'), false)
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device is initially moved within the space of the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerEnter(event) {
    if (event.intersectionData && event.intersectionData.geomItem == this.handle) this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerLeave(event) {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param {MouseEvent} event - The event param.
   */
  onPointerDown(event) {
    // We do not want to handle events
    // that have propagated from children of
    // the slider.
    if (event.intersectionData && event.intersectionData.geomItem == this.handle) super.onPointerDown(event)
  }

  /**
   * Applies a special shinning shader to the handle to illustrate interaction with it.
   */
  highlight() {
    this.handleMat.getParameter('BaseColor').setValue(this.highlightColorParam.getValue())
  }

  /**
   * Removes the shining shader from the handle.
   */
  unhighlight() {
    this.handleMat.getParameter('BaseColor').setValue(this.colorParam.getValue())
  }

  // /**
  //  * The setTargetParam method.
  //  * @param {any} param - The param param.
  //  */
  // setTargetParam(param) {
  //   this.param = param;
  //   const __updateSlider = () => {
  //     this.__updateSlider(param.getValue());
  //   };
  //   __updateSlider();
  //   param.on('valueChanged', __updateSlider);
  // }

  /**
   * Sets global xfo target parameter
   *
   * @param {Parameter} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param
    if (track) {
      if (this.param instanceof XfoParameter) {
        const __updateGizmo = () => {
          this.getParameter('GlobalXfo').setValue(param.getValue())
        }
        __updateGizmo()
        param.on('valueChanged', __updateGizmo)
      } else if (this.param instanceof NumberParameter) {
        const __updateGizmo = () => {
          this.handleXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), param.getValue())
          this.handle.getParameter('GlobalXfo').setValue(this.handleXfo)
        }
        __updateGizmo()
        param.on('valueChanged', __updateGizmo)
      }
    }
  }

  // eslint-disable-next-line require-jsdoc
  // __updateSlider(value) {
  //   this.value = value
  //   const range =
  //     this.param && this.param.getRange() ? this.param.getRange() : [0, 1];
  //   const v = Math.remap(value, range[0], range[1], 0, 1);
  //   const length = this.arcAngleParam.getValue();
  //   this.handleXfo.ori.setFromAxisAndAngle(this.axis, ) = v * length;
  //   this.handle.getParameter('LocalXfo').setValue(this.handleXfo;
  // }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Returns handle's global Xfo
   *
   * @return {Xfo} - The Xfo value
   */
  getBaseXfo() {
    return this.handle.getParameter('GlobalXfo').getValue()
  }

  /**
   * Handles the initially drag interaction of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragStart(event) {
    this.baseXfo = this.getParameter('GlobalXfo').getValue().clone()
    this.baseXfo.sc.set(1, 1, 1)
    this.deltaXfo = new Xfo()
    // this.offsetXfo = this.baseXfo.inverse().multiply(this.param.getValue());

    this.vec0 = this.getParameter('GlobalXfo').getValue().ori.getXaxis()
    // this.grabCircleRadius = this.arcRadiusParam.getValue();
    this.vec0.normalizeInPlace()

    this.change = new ParameterValueChange(this.param)
    UndoRedoManager.getInstance().addChange(this.change)

    // Hilight the material.
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.2
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo)

    this.emit('dragStart')
  }

  /**
   * Handles drag interaction of the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDrag(event) {
    const vec1 = event.holdPos.subtract(this.baseXfo.tr)
    vec1.normalizeInPlace()

    let angle = this.vec0.angleTo(vec1)
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0) angle = -angle

    if (this.range) {
      angle = MathFunctions.clamp(angle, this.range[0], this.range[1])
    }

    if (event.shiftKey) {
      // modulate the angle to X degree increments.
      const increment = Math.degToRad(22.5)
      angle = Math.floor(angle / increment) * increment
    }

    this.deltaXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), angle)

    const newXfo = this.baseXfo.multiply(this.deltaXfo)
    const value = newXfo // .multiply(this.offsetXfo);

    if (this.change) {
      if (this.param instanceof XfoParameter) {
        this.change.update({
          value,
        })
      } else if (this.param instanceof NumberParameter) {
        this.change.update({
          value: angle,
        })
      }
    } else {
      if (this.param instanceof XfoParameter) {
        this.param.setValue(value)
      } else if (this.param instanceof NumberParameter) {
        this.param.setValue(angle)
      }
    }
  }

  /**
   * Handles the end of dragging interaction with the handle.
   *
   * @param {MouseEvent|TouchEvent|object} event - The event param.
   */
  onDragEnd(event) {
    this.change = null
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.0
    this.handle.getParameter('GeomOffsetXfo').setValue(this.handleGeomOffsetXfo)

    this.emit('dragEnd')
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

Registry.register('ArcSlider', ArcSlider)

export default ArcSlider
export { ArcSlider }
