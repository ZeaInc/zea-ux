import { Material, GeomItem, Xfo, Vec3, Color, Label, BillboardItem, Cuboid } from '@zeainc/zea-engine'
import { MeasurementOperator } from './MeasurementOperator'

describe('MeasurementOperator', () => {
  it('Label Text Is Correctly Changed By The Operator', () => {
    const material = new Material('material', 'SimpleSurfaceShader')
    material.getParameter('BaseColor').setValue(new Color('#94C47D'))

    const geomItem1 = new GeomItem('CuboidGeometryItem', new Cuboid(1, 1, 1, true), material)
    const geomItem1Xfo = new Xfo()
    geomItem1Xfo.tr = new Vec3(1.5, -0.5, 0)
    geomItem1.getParameter('GlobalXfo').setValue(geomItem1Xfo)

    const geomItem2 = new GeomItem('TorusGeometryItem', new Cuboid(1, 1, 1, true), material)
    const geomItem2Xfo = new Xfo()
    geomItem2Xfo.tr = new Vec3(-1.5, -0.5, 0)
    geomItem2.getParameter('GlobalXfo').setValue(geomItem2Xfo)

    const measurementOperator = new MeasurementOperator('Measurement')
    measurementOperator.getInput(MeasurementOperator.IO_NAMES.StartXfo).setParam(geomItem1.getParameter('GlobalXfo'))
    measurementOperator.getInput(MeasurementOperator.IO_NAMES.EndXfo).setParam(geomItem2.getParameter('GlobalXfo'))

    const label = new Label('Distance')
    label.getParameter('FontSize').setValue(12)
    label.getParameter('BackgroundColor').setValue(new Color('#94C47D'))

    const billboard = new BillboardItem('DistanceBillboard', label)
    billboard.getParameter('LocalXfo').setValue(new Xfo())
    billboard.getParameter('PixelsPerMeter').setValue(300)
    billboard.getParameter('AlignedToCamera').setValue(true)
    billboard.getParameter('DrawOnTop').setValue(true)
    billboard.getParameter('Alpha').setValue(1)

    measurementOperator.getOutput(MeasurementOperator.IO_NAMES.LabelXfo).setParam(billboard.getParameter('LocalXfo'))
    measurementOperator.getOutput(MeasurementOperator.IO_NAMES.Distance).setParam(label.getParameter('Text'))

    expect(label.getParameter('Text').getValue()).toBe('3m')

    const alteredGeomItem1Xfo = new Xfo()
    alteredGeomItem1Xfo.tr = new Vec3(3, -0.5, 0)
    geomItem1.getParameter('GlobalXfo').setValue(alteredGeomItem1Xfo)
    expect(label.getParameter('Text').getValue()).toBe('4.5m')
  })
})
