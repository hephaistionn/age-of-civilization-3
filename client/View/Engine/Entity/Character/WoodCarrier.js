const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');
const EntityCharacter = require('../EntityCharacter');

const animations = {
    carrier: {duration: 800, steps: new Uint8Array([4, 5, 6, 7, 4])},
};

class WoodCarrier extends EntityCharacter {

    initMesh(model) {
        this.element = new THREE.getMesh('obj/peon.obj', material, model._id);
        const wood = THREE.getMesh('obj/wood_00.obj', materialWood);
        wood.visible = false;
        this.element.add(wood);
        this.animations = animations;
    }

    updateState(model, init) {
        switch(this.model.state) {
            case 1:
                this.currentAnimation = 'carrier';
                this.element.children[0].visible = true;
                this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
                this.walk = true;
                this.moveProgress = init ? this.moveProgress : 0;
                break;
        }

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

module.exports = WoodCarrier;
