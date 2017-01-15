const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float lighting; \n" +
    "varying float vlighting; \n" +
    "void main() { \n" +
    "vec3 positionPlan = vec3(position.x,position.y,position.z); \n" +
    "vec4 worldPosition = modelMatrix * vec4(positionPlan, 1.0 ); \n" +
    "vlighting = lighting; \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";

const fragShader = "" +
    "varying float vlighting; \n" +
    "void main(void) { \n" +
    "vec3 color = vec3(0.0,0.39,0.6); \n" +
    "gl_FragColor.xyz = color  * vlighting; \n" +
    "gl_FragColor.a = 0.50; \n" +
    "} ";

const mat = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true
});

module.exports = mat;
