const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');
const EntityCharacter = require('../EntityCharacter');

const animations = {
    wait: {duration: 800, steps: new Uint8Array([1, 1])},
    walk: {duration: 800, steps: new Uint8Array([0, 1, 2, 3, 0])},
    carrier: {duration: 800, steps: new Uint8Array([4, 5, 6, 7, 4])},
    construct: {duration: 600, steps: new Uint8Array([11, 10, 9, 8, 9])},
    cutAxe: {duration: 600, steps: new Uint8Array([3, 2, 1, 0, 1])}
};

class Builder extends EntityCharacter {

    initMesh(model) {
        this.element = new THREE.getMesh('obj/peon.obj', material, model._id);
        const wood = THREE.getMesh('obj/wood_00.obj', materialWood);
        const axe = THREE.getMesh('obj/axe.obj', material);
        wood.visible = false;
        axe.visible = false;
        this.element.add(axe, wood);
        this.animations = animations;
    }

    updateState(model, init) { 
        
        const step = this.model.step;

        switch(step) {

            case 0:
                this.shape  = null;
                this.currentAnimation = 'wait';
                this.currentAnimationChild = null;
                this.element.children[0].visible = false;
                this.element.children[1].visible = false; 
                this.walk = false;
                break;
            case 1:
                this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
                this.currentAnimation = 'walk';
                this.currentAnimationChild = null;
                this.element.children[0].visible = false;
                this.element.children[1].visible = false; 
                this.moveProgress = init ? this.moveProgress : 0;
                this.walk = true;
                break;
            case 2:
                this.currentAnimation = 'carrier';
                this.currentAnimationChild = null;
                this.element.children[0].visible = false;
                this.element.children[1].visible = true;
                this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
                this.walk = true;
                this.moveProgress = init ? this.moveProgress : 0;
                break;
            case 3:
                this.currentAnimation = 'cutAxe';
                this.currentAnimationChild = 'cutAxe';
                this.element.children[0].visible = true;
                this.walk = false;
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

module.exports = Builder;
