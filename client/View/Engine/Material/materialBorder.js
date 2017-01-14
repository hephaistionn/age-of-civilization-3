const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float color; \n" +
    "varying vec2 vAbsolutePosition; \n" +
    "varying float vColor; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xz; \n" +
    "vColor = color;" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +
    "varying vec2 vAbsolutePosition; \n" +
    "varying float vColor; \n" +
    "" + 
    "uniform sampler2D texture; \n" +
    "uniform float textureSize; \n" +
    "void main(void) { \n" +
    "   vec2 UV = vec2(vAbsolutePosition.x-0.01, vAbsolutePosition.y-0.01)/textureSize; \n" +
    "   vec3 color = texture2D( texture, UV ).xyz; \n" +
    "   if(vColor>0.0) {   \n" +
    "       if(vColor>0.99){ \n"+
    "           gl_FragColor.xyz = vec3(0.3,0.2,0.1)*(color.y+0.5)*0.9; \n"  +
    "       }else{ \n" +
    "           gl_FragColor.xyz = color*0.9; \n" +
    "       } \n" +
    "   }else{ \n" +
    "       if(vColor<-0.99){ \n"+
    "           gl_FragColor.xyz = vec3(0.3,0.2,0.1)*(color.y+0.5)*0.7; \n" +
    "       }else{" +
    "           gl_FragColor.xyz = color*0.7; \n" +
    "       }" +
    "   }" +
    "}";

const uniforms = THREE.UniformsUtils.merge([]);
uniforms.texture = {type: 't', value: null};
uniforms.textureSize = {type: 'f', value: 16};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader
});

module.exports = mat;
