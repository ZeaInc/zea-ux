<a name="Tests for `MeasureDistance` Class"></a>

### Tests for MeasureDistance Class

Use this code to guide yourself on how to implement this class.
```javascript
import { Vec3 } from '@zeainc/zea-engine'
import { MeasureDistance } from './MeasureDistance'
import '../Handles/Shaders/HandleShader'

describe('MeasureDistance', () => {
  it('Label Text Is Correctly Changed By The Operator', () => {
    const measurement = new MeasureDistance('M1')
    measurement.setStartMarkerPos(new Vec3(-1, 0, 0))
    measurement.setEndMarkerPos(new Vec3(1, 0, 0))

    expect(measurement.getMeasurementText()).toBe('2000mm')

    measurement.setStartMarkerPos(new Vec3(-2, 1.5, 0))
    expect(measurement.getMeasurementText()).toBe('3354.102mm')
  })
})

```