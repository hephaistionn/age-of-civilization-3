const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');
const EntityCharacter = require('../EntityCharacter');

const animations = {
    work: {duration: 5000, steps: new Uint8Array([0, 0, 1, 1, 0, 0])}
};

class Seller extends EntityCharacter {

    initMesh(model) {
        this.element = new THREE.getMesh('obj/peon.obj', material, model._id);
        this.animations = animations;
        this.currentAnimation = 'work';
    }
}

module.exports = Seller;
