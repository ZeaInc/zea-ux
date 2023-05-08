import { ProceduralMesh, Xfo } from '@zeainc/zea-engine'

const transformVertices = (geometry: ProceduralMesh, xfo: Xfo) => {
  geometry.update()

  const positions = geometry.positions
  for (let i = 0; i < positions.getCount(); i++) {
    const v = positions.getValue(i)
    const v2 = xfo.transformVec3(v)
    positions.setValue(i, v2)
  }
}

export default transformVertices
