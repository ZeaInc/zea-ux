import { Registry, GLShader, Material } from '@zeainc/zea-engine'

import { HandleMaterial } from './HandleMaterial'

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
  constructor(gl?: any) {
    super(gl)

    this.setShaderStage(
      'VERTEX_SHADER',
      `
precision highp float;

attribute vec3 positions;
#ifdef ENABLE_TEXTURES
attribute vec2 texCoords;
#endif

<%include file="GLSLUtils.glsl"/>
<%include file="stack-gl/transpose.glsl"/>
<%include file="drawItemId.glsl"/>
<%include file="drawItemTexture.glsl"/>
<%include file="modelMatrix.glsl"/>
<%include file="materialparams.glsl"/>

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform lowp int isOrthographic;
uniform vec4 viewportFrustum;


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

  //////////////////////////////////////////////
  // Material
  vec2 materialCoords = v_geomItemData.zw;
  vec4 materialValue1 = getMaterialValue(materialCoords, 1);
  int maintainScreenSize = int(materialValue1.x + 0.5);
  float overlay = materialValue1.y;

  //////////////////////////////////////////////
  // Matrix
  
  mat4 modelMatrix = getModelMatrix(drawItemId);
  if (maintainScreenSize != 0) {
    // Remove the scale from the model matrix.
    vec3 row0 = normalize(vec3(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
    vec3 row1 = normalize(vec3(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
    vec3 row2 = normalize(vec3(modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]));
    modelMatrix = mat4(
      row0.x, row0.y, row0.z, 0.0,
      row1.x, row1.y, row1.z, 0.0,
      row2.x, row2.y, row2.z, 0.0,
      modelMatrix[3][0], modelMatrix[3][1], modelMatrix[3][2], 1.0
    );
  }
  mat4 modelViewMatrix = viewMatrix * modelMatrix;
  if (maintainScreenSize != 0) {
    if (isOrthographic > 0){
      // At a distance of 1, we should match the orthographic and perspective sizes.
      // Calculate the size of the handle in perpective projection at 1 meter.
      // With a 24mm camera, the Fov is 46.4 degrees, or 0.8098327729253689 radians.
      // (0.81 / 2.0) * focalDist * 2.0
      // The frustum height at 1m is 0.81.
      float sc = viewportFrustum.y / 0.8098327;
      mat4 scmat = mat4(
        sc, 0.0, 0.0, 0.0,
        0.0, sc, 0.0, 0.0,
        0.0, 0.0, sc, 0.0,
        0.0, 0.0, 0.0, 1.0
      );
      modelViewMatrix = modelViewMatrix * scmat;
    } else {
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

    this.setShaderStage(
      'FRAGMENT_SHADER',
      `
precision highp float;

<%include file="GLSLUtils.glsl"/>
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

uniform lowp int isOrthographic;
import 'surfaceGeomData.glsl'

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

  vec2 materialCoords = v_geomItemData.zw;
  vec4 baseColor = toLinear(getMaterialValue(materialCoords, 0));

  fragColor = baseColor;

#ifdef ENABLE_INLINE_GAMMACORRECTION
  fragColor.rgb = toGamma(fragColor.rgb);
#endif

  //////////////////////////////////////////////
  // GeomData
#elif defined(DRAW_GEOMDATA)

  fragColor = setFragColor_geomData(v_viewPos, floatGeomBuffer, passId, v_drawItemId, isOrthographic);
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
  }

  /**
   * The getPackedMaterialData method.
   * @param material - The material param.
   * @return - The return value.
   */
  static getPackedMaterialData(material: Material): Float32Array {
    const matData = new Float32Array(8)
    const baseColor = material.getParameter('BaseColor').value
    matData[0] = baseColor.r
    matData[1] = baseColor.g
    matData[2] = baseColor.b
    matData[3] = baseColor.a
    matData[4] = material.getParameter('MaintainScreenSize').value
    matData[5] = material.getParameter('Overlay').value
    return matData
  }

  /**
   * Returns whether the shader's overlay is true or not.
   *
   * @static
   * @return {boolean} - The overlay value
   */
  static isOverlay(): boolean {
    return true
  }

  /**
   * Each shader provides a template material that each material instance is
   * based on. The shader specifies the parameters needed by the shader, and
   * the material provides values to the shader during rendering.
   * @return {Material} - The template material value.
   */
  static getMaterialTemplate(): Material {
    return material
  }
}

const material = new HandleMaterial('HandleShader_template')

Registry.register('HandleShader', HandleShader)

export default HandleShader
export { HandleShader }
