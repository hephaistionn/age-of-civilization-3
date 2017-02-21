const THREE = require('three');
const material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('pic/unity.png'), morphTargets: true});
module.exports = material;