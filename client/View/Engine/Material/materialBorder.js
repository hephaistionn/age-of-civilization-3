const THREE = require('./../../../services/threejs');

const vertShader = "" +
    "attribute float color; \n" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vColor; \n" +
    "void main() { \n" +
    "vec4 worldPosition = modelMatrix * vec4(position, 1.0 ); \n" +
    "vAbsolutePosition = worldPosition.xyz; \n" +
    "vColor = color;" +
    "gl_Position = projectionMatrix * viewMatrix * worldPosition; \n" +
    "} ";


const fragShader = "" +
    "varying vec3 vAbsolutePosition; \n" +
    "varying float vColor; \n" +
    "" +
    "uniform sampler2D texture; \n" +
    "void main(void) { \n" +
    "   vec2 UV = vec2(vAbsolutePosition.x-0.1, vAbsolutePosition.z-0.1)/64.0; \n" +
    "   vec3 color = texture2D( texture, UV ).xyz;" +
    "   float  grid = (color.x+color.y+color.z)/3.0;"+
    "   if(vColor>0.0) {  " +
    "       if(vColor>0.99){"+
    "       gl_FragColor = vec4(vec3(0.3,0.2,0.1)*0.9*(grid+0.5), 1.0); \n"  +
    "       }else{" +
    "           gl_FragColor = vec4(color*0.9, 1.0); \n" +
    "       }" +
    "   }else{" +
    "       if(vColor<-0.99){"+
    "       gl_FragColor = vec4(vec3(0.3,0.2,0.1)*0.7*(grid+0.5), 1.0); \n" +
    "       }else{" +
    "           gl_FragColor = vec4(color*0.7, 1.0); \n" +
    "       }" +
    "   }" +
    "}";

const uniforms = THREE.UniformsUtils.merge([]);
uniforms.texture = {type: 't', value: THREE.loadTexture("pic/rock_0.jpg")};

const mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader
});

module.exports = mat;
