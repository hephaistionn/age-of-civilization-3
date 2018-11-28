const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');
const EntityCharacter = require('../EntityCharacter');

const animations = {
    walk: {duration: 800, steps: new Uint8Array([0, 1, 2, 3, 0])},
};

class Trader extends EntityCharacter {

    initMesh(model) {
        this.element = new THREE.getMesh('obj/peon.obj', material, model._id);
        this.animations = animations;
        if(isNaN(this.moveProgress)) this.moveProgress =0;
    }

    updateState(model, init) { 
        
        const step = this.model.step;

        this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
        this.currentAnimation = 'walk';
        this.currentAnimationChild = null;
        this.moveProgress = init ? this.moveProgress : 0;
        this.walk = true;
        

        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }

}

module.exports = Trader;
