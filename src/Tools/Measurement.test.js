import { Vec3 } from '@zeainc/zea-engine'
import { Measurement } from './Measurement'
import '../Handles/Shaders/HandleShader'

describe('Measurement', () => {
  it('Label Text Is Correctly Changed By The Operator', () => {
    const measurement = new Measurement('M1')
    measurement.setStartMarkerPos(new Vec3(-1, 0, 0))
    measurement.setEndMarkerPos(new Vec3(1, 0, 0))

    expect(measurement.getMeasurementText()).toBe('2m')

    measurement.setStartMarkerPos(new Vec3(-2, 0, 0))
    expect(measurement.getMeasurementText()).toBe('3m')
  })
})
