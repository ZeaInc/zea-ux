import {
  Color,
  Lines,
  BillboardItem,
  Label,
  GeomItem,
  Xfo,
  Vec3,
  Registry,
  Ray,
  Vec3Attribute,
  BillboardAlignment,
} from '@zeainc/zea-engine'

import { Measure } from './Measure'
import { line } from '../helpers/line'

/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureAngle extends Measure {
  /**
   * Creates an instance of MeasureAngle.
   * @param name
   * @param color
   */
  constructor(name = 'MeasureAngle', color = new Color('#F9CE03')) {
    super(name, color)
  }

  /**
   * Given the 2 marker positions, calculate and display the angle.
   */
  createLinesAndLabel(): void {
    this.addChild(this.markerA)
    this.addChild(this.markerB)
    // ////////////////////////////////////////
    // Calculate the angle
    const xfoA = this.markerA.globalXfoParam.value
    const xfoB = this.markerB.globalXfoParam.value

    const normA = xfoA.ori.getZaxis()
    const normB = xfoB.ori.getZaxis()

    const axis = normA.cross(normB).normalize()
    const tangentA = axis.cross(normA).normalize()
    const tangentB = axis.cross(normB).normalize()

    const rayA = new Ray(xfoA.tr, tangentA)
    const rayB = new Ray(xfoB.tr, tangentB)
    // TODO: check this return value is actually an array.
    const params = rayA.intersectRayVector(rayB) as number[]

    const angle = normA.angleTo(normB)

    // ////////////////////////////////////////
    // Build the visualization parts.
    const lineA = new GeomItem('LineA', line, this.lineMaterial)
    lineA.pickableParam.value = false
    const lineB = new GeomItem('LineB', line, this.lineMaterial)
    lineB.pickableParam.value = false
    const lineC = new GeomItem('LineC', line, this.lineMaterial)
    lineC.pickableParam.value = false
    this.markerA.addChild(lineA, false)
    this.markerB.addChild(lineB, false)

    const labelXfo = new Xfo()
    labelXfo.tr.addInPlace(rayA.pointAtDist(params[0]))
    labelXfo.tr.addInPlace(rayB.pointAtDist(params[1]))
    labelXfo.tr.scaleInPlace(0.5)

    xfoA.ori.setFromDirectionAndUpvector(tangentA.negate(), normA)
    this.markerA.globalXfoParam.value = xfoA
    xfoB.ori.setFromDirectionAndUpvector(tangentB, normA)
    this.markerB.globalXfoParam.value = xfoB

    const lineAXfo = new Xfo()
    lineAXfo.sc.z = -params[0]
    lineA.localXfoParam.value = lineAXfo
    const lineBXfo = new Xfo()
    lineBXfo.sc.z = params[1]
    lineB.localXfoParam.value = lineBXfo

    this.createLabel(`${(angle / (Math.PI / 180)).toFixed(3)} °`, BillboardAlignment.AlignedToCamera)
    this.billboard.globalXfoParam.value = labelXfo
  }

  /**
   *
   *
   * @param xfo
   */
  setXfoA(xfo: Xfo): void {
    this.markerA.globalXfoParam.value = xfo
    this.markerB.globalXfoParam.value = xfo
  }

  /**
   *
   *
   * @return {Xfo}
   */
  getXfoA(): Xfo {
    return this.markerA.globalXfoParam.value
  }

  /**
   *
   *
   * @param xfo
   */
  setXfoB(xfo: Xfo): void {
    this.markerB.globalXfoParam.value = xfo
    this.createLinesAndLabel()
  }
}

Registry.register('MeasureAngle', MeasureAngle)

export { MeasureAngle }
