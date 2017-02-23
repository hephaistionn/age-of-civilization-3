const material = require('../../Material/materialB');
const EntityCharacter = require('../EntityCharacter');
const THREE = require('three');

const animations = {
    walk: {duration: 800, steps: new Uint8Array([0, 1, 2, 3, 0])}
};

class Peon extends EntityCharacter {

    initMesh(model) {
        this.element = THREE.getMesh('obj/peon.obj', material, model._id);
        this.animations = animations;
        this.currentAnimation = 'walk';
    }

}

module.exports = Peon;
