import { Color, Registry, shaderLibrary, GLShader } from '@zeainc/zea-engine'

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
varying float v_drawItemId;
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif

void main(void) {
  int drawItemId = getDrawItemId();
  v_drawItemId = float(drawItemId);
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

<%include file="math/constants.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="stack-gl/gamma.glsl"/>
<%include file="materialparams.glsl"/>


#if defined(DRAW_COLOR)

uniform color BaseColor;

#ifdef ENABLE_TEXTURES
uniform sampler2D BaseColorTex;
uniform int BaseColorTexType;
#endif

#elif defined(DRAW_GEOMDATA)

uniform int floatGeomBuffer;
uniform int passId;

<%include file="GLSLBits.glsl"/>

#elif defined(DRAW_HIGHLIGHT)

#ifdef ENABLE_FLOAT_TEXTURES
vec4 getHighlightColor(int id) {
  return fetchTexel(instancesTexture, instancesTextureSize, (id * pixelsPerItem) + 4);
}
#else // ENABLE_FLOAT_TEXTURES

uniform vec4 highlightColor;

vec4 getHighlightColor() {
    return highlightColor;
}

#endif // ENABLE_FLOAT_TEXTURES

#endif // DRAW_HIGHLIGHT

/* VS Outputs */
varying float v_drawItemId;
varying vec4 v_geomItemData;
varying vec3 v_viewPos;
#ifdef ENABLE_TEXTURES
varying vec2 v_textureCoord;
#endif


#ifdef ENABLE_ES3
  out vec4 fragColor;
#endif
void main(void) {
#ifndef ENABLE_ES3
  vec4 fragColor;
#endif

  int drawItemId = int(v_drawItemId + 0.5);

  //////////////////////////////////////////////
  // Color
#if defined(DRAW_COLOR)


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

  fragColor = baseColor;

#ifdef ENABLE_INLINE_GAMMACORRECTION
  fragColor.rgb = toGamma(fragColor.rgb);
#endif

  //////////////////////////////////////////////
  // GeomData
#elif defined(DRAW_GEOMDATA)

  float viewDist = length(v_viewPos);

  if(floatGeomBuffer != 0) {
    fragColor.r = float(passId); 
    fragColor.g = float(v_drawItemId);
    fragColor.b = 0.0;// TODO: store poly-id or something.
    fragColor.a = viewDist;
  } else {
    ///////////////////////////////////
    // UInt8 buffer
    fragColor.r = mod(v_drawItemId, 256.) / 256.;
    fragColor.g = (floor(v_drawItemId / 256.) + (float(passId) * 64.)) / 256.;

    // encode the dist as a 16 bit float
    vec2 float16bits = encode16BitFloatInto2xUInt8(viewDist);
    fragColor.b = float16bits.x;
    fragColor.a = float16bits.y;
  }

  //////////////////////////////////////////////
  // Highlight
#elif defined(DRAW_HIGHLIGHT)
  
  fragColor = getHighlightColor(drawItemId);

#endif // DRAW_HIGHLIGHT

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
    return true
  }
}

Registry.register('HandleShader', HandleShader)

export default HandleShader
export { HandleShader }
