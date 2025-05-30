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
  ZeaPointerEvent,
  ZeaMouseEvent,
  ZeaTouchEvent,
} from '@zeainc/zea-engine'
import { Handle } from './Handle'
import ParameterValueChange from '../UndoRedo/Changes/ParameterValueChange'
import './Shaders/HandleShader'
import UndoRedoManager from '../UndoRedo/UndoRedoManager'
import { Change } from '../UndoRedo/Change'
import HandleMaterial from './Shaders/HandleMaterial'

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
 * @extends Handle
 */
class ArcSlider extends Handle {
  param: XfoParameter | NumberParameter
  arcRadiusParam: NumberParameter
  arcAngleParam: NumberParameter
  handleRadiusParam: NumberParameter
  range: Array<number>
  private handleMat: HandleMaterial
  private handle: GeomItem
  private arc: GeomItem
  private baseXfo: Xfo
  private handleXfo = new Xfo()
  private vec0: Vec3
  private change: Change
  private handleGeomOffsetXfo = new Xfo()

  /**
   * Creates an instance of ArcSlider.
   *
   * @param name - The name value
   * @param [arcRadius=1] - The arcRadius value
   * @param [arcAngle=1] - The arcAngle value
   * @param [handleRadius=0.02] - The handleRadius value
   * @param [color=new Color(1, 1, 0)] - the color value
   */
  constructor(name?: string, arcRadius = 1, arcAngle = 1, handleRadius = 0.02, color = new Color(1, 1, 0)) {
    super(name)
    this.arcRadiusParam = new NumberParameter('ArcRadius', arcRadius)
    this.arcAngleParam = new NumberParameter('ArcAngle', arcAngle)
    this.handleRadiusParam = new NumberParameter('HandleRadius', handleRadius)
    this.addParameter(this.arcRadiusParam)
    this.addParameter(this.arcAngleParam)
    this.addParameter(this.handleRadiusParam)
    // this.barRadiusParam = this.addParameter(
    //   new NumberParameter('Bar Radius', radius * 0.25)
    // );
    this.colorParam.value = color

    this.handleMat = new HandleMaterial('handleMat')
    this.handleMat.baseColorParam.value = color

    const arcGeom = new Circle(arcRadius, 64, arcAngle)
    const handleGeom = new Sphere(handleRadius, 64)

    this.handle = new GeomItem('handle', handleGeom, this.handleMat)
    this.arc = new GeomItem('arc', arcGeom, this.handleMat)
    this.handleGeomOffsetXfo.tr.x = arcRadius
    this.handle.geomOffsetXfoParam.value = this.handleGeomOffsetXfo

    // this.barRadiusParam.on('valueChanged', () => {
    //   arcGeom.radiusParam.value = this.barRadiusParam.value;
    // });

    this.range = [0, arcAngle]
    this.arcAngleParam.on('valueChanged', () => {
      const arcAngle = this.arcAngleParam.value
      arcGeom.angleParam.value = arcAngle
      this.range = [0, arcAngle]
    })
    this.arcRadiusParam.on('valueChanged', () => {
      const arcRadius = this.arcRadiusParam.value
      arcGeom.radiusParam.value = arcRadius
      this.handleGeomOffsetXfo.tr.x = arcRadius
      this.handle.geomOffsetXfoParam.value = this.handleGeomOffsetXfo
    })
    this.handleRadiusParam.on('valueChanged', () => {
      handleGeom.radiusParam.value = this.handleRadiusParam.value
    })

    this.colorParam.on('valueChanged', () => {
      this.handleMat.baseColorParam.value = this.colorParam.value
    })

    this.addChild(this.handle)
    this.addChild(this.arc)

    // this.__updateSlider(0);
    this.setTargetParam(this.handle.globalXfoParam, false)
  }

  // ///////////////////////////////////
  // Mouse events

  /**
   * Event fired when a pointing device is initially moved within the space of the handle.
   *
   * @param event - The event param.
   */
  onPointerEnter(event: ZeaPointerEvent): void {
    if (event.intersectionData && event.intersectionData.geomItem == this.handle) this.highlight()
  }

  /**
   * Event fired when a pointing device moves outside of the space of the handle.
   *
   * @param event - The event param.
   */
  onPointerLeave(event: ZeaPointerEvent): void {
    this.unhighlight()
  }

  /**
   * Event fired when a pointing device button is pressed while the pointer is over the handle element.
   *
   * @param event - The event param.
   */
  onPointerDown(event: ZeaPointerEvent): void {
    // We do not want to handle events
    // that have propagated from children of
    // the slider.
    if (event.intersectionData && event.intersectionData.geomItem == this.handle) super.onPointerDown(event)
  }

  /**
   * highlight the handle to indicate it is under the mouse.
   */
  highlight(): void {
    super.highlight()
    this.handleMat.baseColorParam.value = this.highlightColorParam.value
  }

  /**
   * Removes the highlight from the handle once the mouse moves away.
   */
  unhighlight(): void {
    super.unhighlight()
    this.handleMat.baseColorParam.value = this.colorParam.value
  }

  /**
   * Sets global xfo target parameter
   *
   * @param param - The parameter that will be modified during manipulation
   * @param track - The track param.
   */
  setTargetParam(param: XfoParameter | NumberParameter, track = true): void {
    this.param = param
    if (track) {
      if (this.param instanceof XfoParameter) {
        const __updateGizmo = () => {
          this.globalXfoParam.value = <Xfo>param.value
        }
        __updateGizmo()
        param.on('valueChanged', __updateGizmo)
      } else if (this.param instanceof NumberParameter) {
        const __updateGizmo = () => {
          this.handleXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), <number>param.value)
          this.handle.globalXfoParam.value = this.handleXfo
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
  //   const length = this.arcAngleParam.value;
  //   this.handleXfo.ori.setFromAxisAndAngle(this.axis, ) = v * length;
  //   this.handle.localXfoParam.value = this.handleXfo;
  // }

  // ///////////////////////////////////
  // Interaction events

  /**
   * Returns handle's global Xfo
   *
   * @return {Xfo} - The Xfo value
   */
  getBaseXfo(): Xfo {
    return this.handle.globalXfoParam.value
  }

  /**
   * Handles the initially drag interaction of the handle.
   *
   * @param event - The event param.
   */
  onDragStart(event: ZeaPointerEvent): void {
    this.baseXfo = this.globalXfoParam.value.clone()
    this.baseXfo.sc.set(1, 1, 1)
    // this.offsetXfo = this.baseXfo.inverse().multiply(this.param.value);

    this.vec0 = this.globalXfoParam.value.ori.getXaxis()
    // this.grabCircleRadius = this.arcRadiusParam.value;
    this.vec0.normalizeInPlace()

    this.change = new ParameterValueChange(this.param)
    UndoRedoManager.getInstance().addChange(this.change)

    // Hilight the material.
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.2
    this.handle.geomOffsetXfoParam.value = this.handleGeomOffsetXfo

    this.emit('dragStart')
  }

  /**
   * Handles drag interaction of the handle.
   *
   * @param event - The event param.
   */
  onDrag(event: ZeaPointerEvent): void {
    const vec1 = this.holdPos.subtract(this.baseXfo.tr)
    vec1.normalizeInPlace()

    let angle = this.vec0.angleTo(vec1)
    if (this.vec0.cross(vec1).dot(this.baseXfo.ori.getZaxis()) < 0) angle = -angle

    if (this.range) {
      angle = MathFunctions.clamp(angle, this.range[0], this.range[1])
    }

    if ((event instanceof ZeaMouseEvent || event instanceof ZeaTouchEvent) && event.shiftKey) {
      // modulate the angle to X degree increments.
      const degree: number = 22.5
      const rad: number = degree * (Math.PI / 180)
      const increment = rad //Math.degToRad(22.5)
      angle = Math.floor(angle / increment) * increment
    }

    const deltaXfo = new Xfo()
    deltaXfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), angle)

    const newXfo = this.baseXfo.multiply(deltaXfo)
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
        this.param.value = value
      } else if (this.param instanceof NumberParameter) {
        this.param.value = angle
      }
    }
  }

  /**
   * Handles the end of dragging interaction with the handle.
   *
   * @param event - The event param.
   */
  onDragEnd(event: ZeaPointerEvent): void {
    this.change = null
    this.handleGeomOffsetXfo.sc.x = this.handleGeomOffsetXfo.sc.y = this.handleGeomOffsetXfo.sc.z = 1.0
    this.handle.geomOffsetXfoParam.value = this.handleGeomOffsetXfo

    this.emit('dragEnd')
  }

  /**
   * Serializes handle item as a JSON object.
   *
   * @param context - The context param.
   * @return {object} The return value.
   */
  toJSON(context: Record<string, any>): Record<string, any> {
    const json = super.toJSON(context)
    if (this.param) json.targetParam = this.param.getPath()
    return json
  }

  /**
   * Restores handle item from a JSON object.
   *
   * @param json - The json param.
   * @param context - The context param.
   */
  fromJSON(json: Record<string, any>, context: Record<string, any>): void {
    super.fromJSON(json, context)

    if (json.targetParam) {
      context.resolvePath(json.targetParam).then((param: any) => {
        this.setTargetParam(param)
      })
    }
  }
}

Registry.register('ArcSlider', ArcSlider)

export default ArcSlider
export { ArcSlider }
