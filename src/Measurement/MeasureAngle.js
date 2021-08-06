import {
  TreeItem,
  Material,
  Color,
  Sphere,
  Lines,
  BillboardItem,
  Label,
  GeomItem,
  Xfo,
  Vec3,
  ColorParameter,
  Registry,
  Ray,
} from '@zeainc/zea-engine'

const sphere = new Sphere(0.003, 24, 12, false)
const line = new Lines(0.0)
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
line.getVertexAttribute('positions').getValueRef(1).setFromOther(new Vec3(0, 0, 1))
/**
 *
 *
 * @extends {TreeItem}
 */
class MeasureAngle extends TreeItem {
  /**
   * Creates an instance of MeasureAngle.
   * @param {string} name
   * @param {Color} color
   */
  constructor(name = 'MeasureAngle', color = new Color('#FCFC00')) {
    super(name)

    this.colorParam = this.addParameter(new ColorParameter('Color', color))

    this.markerMaterial = new Material('Marker', 'HandleShader')
    this.markerMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.markerMaterial.getParameter('MaintainScreenSize').setValue(1)
    this.markerMaterial.getParameter('Overlay').setValue(0.5)

    this.lineMaterial = new Material('Line', 'LinesShader')
    this.lineMaterial.getParameter('BaseColor').setValue(this.colorParam.getValue())
    this.lineMaterial.getParameter('Overlay').setValue(0.5)

    this.markerA = new GeomItem(`markerA`, sphere, this.markerMaterial)
    this.markerB = new GeomItem(`markerB`, sphere, this.markerMaterial)
    this.addChild(this.markerA)
    this.addChild(this.markerB)
  }

  createLinesAndLabel() {
    this.markerA.addChild(new GeomItem('Line', line, this.lineMaterial), false)
    this.markerB.addChild(new GeomItem('Line', line, this.lineMaterial), false)

    this.label = new Label('Distance')
    this.label.getParameter('FontSize').setValue(20)
    this.label.getParameter('BackgroundColor').setValue(this.colorParam.getValue())

    this.billboard = new BillboardItem('DistanceBillboard', this.label)
    this.billboard.getParameter('LocalXfo').setValue(new Xfo())
    this.billboard.getParameter('PixelsPerMeter').setValue(1500)
    this.billboard.getParameter('AlignedToCamera').setValue(true)
    this.billboard.getParameter('DrawOnTop').setValue(true)
    this.billboard.getParameter('FixedSizeOnscreen').setValue(true)
    this.billboard.getParameter('Alpha').setValue(1)

    // this.measurementOp.getOutput(MeasureAngleOperator.IO_NAMES.Distance).setParam(this.label.getParameter('Text'))
    // this.measurementOp.getOutput(MeasureAngleOperator.IO_NAMES.LabelXfo).setParam(billboard.getParameter('GlobalXfo'))

    this.addChild(this.billboard)

    this.colorParam.on('valueChanged', () => {
      const color = this.colorParam.getValue()
      this.markerMaterial.getParameter('BaseColor').setValue(color)
      this.lineMaterial.getParameter('BaseColor').setValue(color)
      this.label.getParameter('BackgroundColor').setValue(color)
    })
  }

  calcAngle() {
    const xfoA = this.markerA.getParameter('GlobalXfo').getValue()
    const xfoB = this.markerB.getParameter('GlobalXfo').getValue()

    const normA = xfoA.ori.getZaxis()
    const normB = xfoB.ori.getZaxis()
    const axis = normA.cross(normB).normalize()
    const tangentA = axis.cross(normA).normalize()
    const tangentB = axis.cross(normB).normalize()

    const rayA = new Ray(xfoA.tr, tangentA)
    const rayB = new Ray(xfoB.tr, tangentB)
    const params = rayA.intersectRayVector(rayB)

    const angle = tangentA.angleTo(tangentB)

    const labelXfo = new Xfo()
    labelXfo.tr.addInPlace(rayA.pointAtDist(params[0]))
    labelXfo.tr.addInPlace(rayB.pointAtDist(params[1]))
    labelXfo.tr.scaleInPlace(0.5)

    xfoA.ori.setFromDirectionAndUpvector(labelXfo.tr.subtract(xfoA.tr), normA)
    this.markerA.getParameter('GlobalXfo').setValue(xfoA)
    xfoB.ori.setFromDirectionAndUpvector(labelXfo.tr.subtract(xfoB.tr), normA)
    this.markerB.getParameter('GlobalXfo').setValue(xfoB)

    const lineAXfo = new Xfo()
    lineAXfo.sc.z = params[0]
    this.markerA.getChild(0).getParameter('LocalXfo').setValue(lineAXfo)
    const lineBXfo = new Xfo()
    lineBXfo.sc.z = params[1]
    this.markerB.getChild(0).getParameter('LocalXfo').setValue(lineBXfo)

    this.label.getParameter('Text').setValue(`${(angle / (Math.PI / 180)).toFixed(3)} °`)

    this.billboard.getParameter('GlobalXfo').setValue(labelXfo)
  }

  /**
   *
   *
   * @param {Xfo} xfo
   */
  setXfoA(xfo) {
    if (!this.markerA) {
    }

    this.markerA.getParameter('GlobalXfo').setValue(xfo)
    this.markerB.getParameter('GlobalXfo').setValue(xfo)
  }

  /**
   *
   *
   * @param {Xfo} xfo
   */
  setXfoB(xfo) {
    this.markerB.getParameter('GlobalXfo').setValue(xfo)
    this.createLinesAndLabel()
    this.calcAngle()
  }
}

Registry.register('MeasureAngle', MeasureAngle)

export { MeasureAngle }
