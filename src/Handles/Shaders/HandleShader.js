import { Color, Registry, shaderLibrary, GLShader } from '@zeainc/zea-engine'
import './HandleGeomDataShader'

/**
 * Class representing Handle Shader.
 *
 * @extends {GLShader}
 */
class HandleShader extends GLShader {
  /**
   * Creates an instance of HandleShader.
   *
   * @param {*} gl - The gl value
   */
  constructor(gl) {
    super(gl)

    this.__shaderStages['VERTEX_SHADER'] = shaderLibrary.parseShader(
      'HandleShader.vertexShader',
      `
precision highp float;

attribute vec3 positions;
#ifdef ENABLE_TEXTURES
attribute vec2 texCoords;
#endif

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

/* VS Outputs */
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif

void main(void) {
  int drawItemId = getDrawItemId();
  v_geomItemData  = getInstanceData(drawItemId);
  mat4 modelMatrix = getModelMatrix(drawItemId);
  mat4 modelViewMatrix = viewMatrix * modelMatrix;

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
  
  if (maintainScreenSize != 0) {
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

  v_viewPos = viewPos.xyz;
  v_textureCoord = texCoords;
  v_textureCoord.y = 1.0 - v_textureCoord.y;// Flip y
}
`
    )

    this.__shaderStages['FRAGMENT_SHADER'] = shaderLibrary.parseShader(
      'HandleShader.fragmentShader',
      `
precision highp float;

<%include file="GLSLUtils.glsl"/>
<%include file="stack-gl/gamma.glsl"/>
<%include file="materialparams.glsl"/>

uniform color BaseColor;

#ifdef ENABLE_TEXTURES
uniform sampler2D BaseColorTex;
uniform int BaseColorTexType;
#endif

/* VS Outputs */
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif


#ifdef ENABLE_ES3
    out vec4 fragColor;
#endif
void main(void) {

  //////////////////////////////////////////////
  // Material

#ifdef ENABLE_MULTI_DRAW

  vec2 materialCoords = v_geomItemData.zw;
  vec4 baseColor = toLinear(getMaterialValue(materialCoords, 0));

#else // ENABLE_MULTI_DRAW

#ifndef ENABLE_TEXTURES
  vec4 baseColor = toLinear(BaseColor);
#else
  vec4 baseColor = getColorParamValue(BaseColor, BaseColorTex, BaseColorTexType, v_textureCoord);
#endif // ENABLE_TEXTURES

#endif // ENABLE_MULTI_DRAW
  //////////////////////////////////////////////

#ifndef ENABLE_ES3
    vec4 fragColor;
#endif
    fragColor = baseColor;

#ifdef ENABLE_INLINE_GAMMACORRECTION
    fragColor.rgb = toGamma(fragColor.rgb);
#endif

#ifndef ENABLE_ES3
    gl_FragColor = fragColor;
#endif
}
`
    )

    this.finalize()
  }

  /**
   * Returns parameter declarations
   *
   * @static
   * @return {array} - Params declarations
   */
  static getParamDeclarations() {
    const paramDescs = super.getParamDeclarations()
    paramDescs.push({
      name: 'BaseColor',
      defaultValue: new Color(1.0, 1.0, 0.5),
    })
    paramDescs.push({
      name: 'MaintainScreenSize',
      defaultValue: 0,
    })
    paramDescs.push({ name: 'Overlay', defaultValue: 0.0 })
    return paramDescs
  }

  /**
   * The getPackedMaterialData method.
   * @param {any} material - The material param.
   * @return {any} - The return value.
   */
  static getPackedMaterialData(material) {
    const matData = new Float32Array(8)
    const baseColor = material.getParameter('BaseColor').getValue()
    matData[0] = baseColor.r
    matData[1] = baseColor.g
    matData[2] = baseColor.b
    matData[3] = baseColor.a
    matData[4] = material.getParameter('MaintainScreenSize').getValue()
    matData[5] = material.getParameter('Overlay').getValue()
    return matData
  }

  /**
   * Returns whether the shader's overlay is true or not.
   *
   * @static
   * @return {boolean} - The overlay value
   */
  static isOverlay() {
    // Handles are now rendered in the GLStandardGeomPass, and we now use the overlay parameter to move the geom closer to the screen.
    return true
  }

  /**
   * Returns shader name
   *
   * @static
   * @return {string} - The Geom Shader value
   */
  static getGeomDataShaderName() {
    return 'HandleGeomDataShader'
  }

  // static getSelectedShaderName(){
  //     return 'StandardSurfaceSelectedGeomsShader';
  // }
}

Registry.register('HandleShader', HandleShader)

export default HandleShader
export { HandleShader }
