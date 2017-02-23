const THREE = require('three');
const material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('pic/entity.png'),
    side: THREE.DoubleSide
});
module.exports = material;