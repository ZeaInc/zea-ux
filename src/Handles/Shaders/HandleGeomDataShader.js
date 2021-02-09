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


<%include file="stack-gl/transpose.glsl"/>
<%include file="drawItemId.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="modelMatrix.glsl"/>


uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

#ifdef ENABLE_MULTI_DRAW
<%include file="materialparams.glsl"/>
#else
uniform int MaintainScreenSize;
uniform float Overlay;
#endif


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

  //////////////////////////////////////////////
  // Material

#ifdef ENABLE_MULTI_DRAW
  vec2 materialCoords = v_geomItemData.zw;
  vec4 materialValue1 = getMaterialValue(materialCoords, 1);
  int maintainScreenSize = int(materialValue1.x + 0.5);
  float overlay = materialValue1.y;
#else
  int maintainScreenSize = MaintainScreenSize;
  float overlay = Overlay;
#endif

  //////////////////////////////////////////////
  
  if(maintainScreenSize != 0) {
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

  if(overlay > 0.0){
    gl_Position.z = mix(gl_Position.z, -gl_Position.w, overlay);
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
