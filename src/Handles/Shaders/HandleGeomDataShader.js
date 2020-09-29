import { Registry, shaderLibrary, StandardSurfaceGeomDataShader } from '@zeainc/zea-engine'
/**
 * Class representing Geometry Data Shader
 *
 * @extends {StandardSurfaceGeomDataShader}
 */
class HandleGeomDataShader extends StandardSurfaceGeomDataShader {
  /**
   * Creates an instance of HandleGeomDataShader.
   * @param {*} gl - The gl value
   * @param {*} floatGeomBuffer - The floatGeomBuffer value
   */
  constructor(gl, floatGeomBuffer) {
    super(gl)
    this.__shaderStages['VERTEX_SHADER'] = shaderLibrary.parseShader(
      'HandleGeomDataShader.vertexShader',
      `
precision highp float;

attribute vec3 positions;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform int MaintainScreenSize;
uniform float Overlay;

<%include file="stack-gl/transpose.glsl"/>
<%include file="drawItemId.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="modelMatrix.glsl"/>


varying float v_drawItemId;
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
varying float v_drawItemID;
varying vec3 v_worldPos;

void main(void) {
  int drawItemId = getDrawItemId();
  mat4 modelMatrix = getModelMatrix(drawItemId);
  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  v_geomItemData = getInstanceData(drawItemId);

  if(MaintainScreenSize != 0) {
    float dist = modelViewMatrix[3][2];
    float sc = abs(dist); // Note: items in front of the camera will have a negative value here.
    mat4 scmat = mat4(
      sc, 0.0, 0.0, 0.0,
      0.0, sc, 0.0, 0.0,
      0.0, 0.0, sc, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
    modelViewMatrix = modelViewMatrix * scmat;
  }

  vec4 viewPos = modelViewMatrix * vec4(positions, 1.0);
  gl_Position = projectionMatrix * viewPos;

  if(Overlay > 0.0){
    gl_Position.z = mix(gl_Position.z, -1.0, Overlay);
  }

  v_viewPos = -viewPos.xyz;

  v_drawItemID = float(getDrawItemId());
}
`
    )
  }
}

Registry.register('HandleGeomDataShader', HandleGeomDataShader)

export default HandleGeomDataShader
export { HandleGeomDataShader }
