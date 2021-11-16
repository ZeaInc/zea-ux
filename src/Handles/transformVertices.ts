const transformVertices = (geometry, xfo) => {
  geometry.update()

  const positions = geometry.getVertexAttribute('positions')
  for (let i = 0; i < positions.getCount(); i++) {
    const v = positions.getValueRef(i)
    const v2 = xfo.transformVec3(v)
    v.set(v2.x, v2.y, v2.z)
  }
}

export default transformVertices
