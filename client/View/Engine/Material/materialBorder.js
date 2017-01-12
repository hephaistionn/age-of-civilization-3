const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute vec3 color; \n" +
    "varying vec3 vColor; \n" +
    "void main() { \n" +
    "vColor = color;"+
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +
    "varying vec3 vColor; \n" +
    "" +
    "uniform vec3 ambientLightColor; \n" +
    "void main(void) { \n" +
    "       gl_FragColor = vec4(vColor, 1.0); \n" +
    "}";

const mat = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader
});

module.exports = mat;
