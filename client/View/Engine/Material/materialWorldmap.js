const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz; \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +

    "struct DirectionalLight { \n" +
    "    vec3 direction; \n" +
    "    vec3 color; \n" +
    "    int shadow; \n" +
    "    float shadowBias; \n" +
    "    float shadowRadius; \n" +
    "    vec2 shadowMapSize; \n" +
    "}; \n" +
    "uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ]; \n" +
    "varying vec3 vecNormal; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "uniform sampler2D texture; \n"+
    "uniform float textureSize; \n" +
    "" +
    "uniform vec3 ambientLightColor; \n" +
    "void main(void) { \n" +
    "" +
    "vec2 UV = vec2(vAbsolutePosition.x, vAbsolutePosition.z)/textureSize; \n" +
    "vec3 color = texture2D( texture, UV ).xyz; \n" +
    "vec3 sumLights = vec3(0.0, 0.0, 0.0); \n" +
    "DirectionalLight directionalLight;" +
    "for(int i = 0; i < NUM_DIR_LIGHTS; i++) \n" +
    "{ \n" +
    "    directionalLight = directionalLights[ i ]; \n" +
    "    sumLights += dot(directionalLight.direction, vecNormal)* directionalLight.color; \n" +
    "} \n" +
    "sumLights = ambientLightColor + sumLights; \n" +
    "color *= sumLights; \n" +
    "if(vAbsolutePosition.y<3.0){ \n" +
    "   color = mix(vec3(0.0,0.0,0.0), color, vAbsolutePosition.y/3.0); \n" +
    "}" +
    "gl_FragColor = vec4(color , 1.0); \n" +
    "} ";

const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    THREE.UniformsLib['ambient']
]);

uniforms.texture = {type: 't', value: null};
uniforms.textureSize = {type: 'f', value: 16};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true
});

module.exports = mat;
