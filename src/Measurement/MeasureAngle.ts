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
} from '@zeainc/zea-engine'

import { Measure } from './Measure'

const line = new Lines() //new Lines(0.0)
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
const positions = <Vec3Attribute>line.getVertexAttribute('positions')
positions.setValue(0, new Vec3())
positions.setValue(1, new Vec3(0, 0, 1))
line.setBoundingBoxDirty()
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
    const lineA = new GeomItem('Line', line, this.lineMaterial)
    const lineB = new GeomItem('Line', line, this.lineMaterial)
    this.markerA.addChild(lineA, false)
    this.markerB.addChild(lineB, false)

    this.label = new Label('Distance')
    this.label.fontSizeParam.value = 20
    this.label.backgroundColorParam.value = this.colorParam.value
    this.label.textParam.value = `${(angle / (Math.PI / 180)).toFixed(3)} °`

    this.billboard = new BillboardItem('DistanceBillboard', this.label)
    this.billboard.localXfoParam.value = new Xfo()
    this.billboard.pixelsPerMeterParam.value = 1500
    this.billboard.alignedToCameraParam.value = true
    this.billboard.drawOnTopParam.value = true
    this.billboard.fixedSizeOnscreenParam.value = true
    this.billboard.alphaParam.value = 1

    this.addChild(this.billboard)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.value
      this.markerMaterial.getParameter('BaseColor').value = color
      this.lineMaterial.baseColorParam.value = color
      this.label.backgroundColorParam.value = color
    })

    const labelXfo = new Xfo()
    labelXfo.tr.addInPlace(rayA.pointAtDist(params[0]))
    labelXfo.tr.addInPlace(rayB.pointAtDist(params[1]))
    labelXfo.tr.scaleInPlace(0.5)

    xfoA.ori.setFromDirectionAndUpvector(tangentA, normA)
    this.markerA.globalXfoParam.value = xfoA
    xfoB.ori.setFromDirectionAndUpvector(tangentB, normA)
    this.markerB.globalXfoParam.value = xfoB

    const lineAXfo = new Xfo()
    lineAXfo.sc.z = params[0]
    lineA.localXfoParam.value = lineAXfo
    const lineBXfo = new Xfo()
    lineBXfo.sc.z = params[1]
    lineB.localXfoParam.value = lineBXfo

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
