import { Color, Lines, LinesMaterial, Vec3, Vec3Attribute } from '@zeainc/zea-engine'

const line = new Lines()
line.setNumVertices(2)
line.setNumSegments(1)
line.setSegmentVertexIndices(0, 0, 1)
const positions = line.getVertexAttribute('positions') as Vec3Attribute
positions.setValue(0, new Vec3(0.0, 0.0, 0.0))
positions.setValue(1, new Vec3(0.0, 0.0, -1.0))
line.setBoundingBoxDirty()

const lineMaterial = new LinesMaterial('line')
lineMaterial.baseColorParam.value = new Color(0.2, 1.0, 0.2)

export { line, lineMaterial }
