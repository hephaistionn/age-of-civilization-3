const THREE = require('three');
const material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('pic/home_00.png'),
    side: THREE.DoubleSide
});
module.exports = material;