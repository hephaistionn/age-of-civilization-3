const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');

const animations = {
    walk: {duration: 800, steps: new Uint8Array([0, 1, 2, 3, 0])},
    cut: {duration: 500, steps: new Uint8Array([0, 0, 0, 1, 2, 2, 2, 1, 1, 0])},
    carrier: {duration: 800, steps: new Uint8Array([4, 5, 6, 7, 4])}
};

class WoodCutter {

    constructor(model, parent) {
        this.model = model;
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.add(parent);
        this.updateMesh();
        this.animations = animations;
        this.shape = new Shape(model.path || [], tileSize, tileHeight);
        this.moveSpeed = model._speed * tileSize;
        this.moveProgress = model.timer * this.moveSpeed;
        this.currentAnimation = 'walk';
        this.updateState(model, true);

    }

    update(dt) {
        if(this.model.state === 1 || this.model.state === 3) {
            this.followPath(dt);
        }
        this.playAnimation(dt);
    }

    updateState(model, init) {
        this.updateMesh();
        if(this.model.state === 1) {
            this.currentAnimation = 'walk';
            if(!init) {
                this.moveProgress = 0;
            }
            this.animProgress = 0;
            this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
        } else if(this.model.state === 3) {
            this.currentAnimation = 'carrier';
            this.animProgress = 0;
            if(!init) {
                this.moveProgress = 0;
            }
            this.addItem();
            this.shape = new Shape(this.model.path || [], tileSize, tileHeight);
        } else {
            this.currentAnimation = 'cut';
            this.animProgress = 0;
        }

        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
        if(this.element.children[0])
            this.element.children[0].matrixWorld = this.element.matrixWorld;
        if(this.element.children[1])
            this.element.children[1].matrixWorld = this.element.matrixWorld;

    }

    updateMesh() {
        let path;
        if(this.model.state === 2) {
            path = 'obj/woodCutter/woodCutter.obj';
        } else {
            path = 'obj/unityA/unityA.obj';
        }
        this.replaceMesh(path, material, this.model);
    }

    addItem() {
        const meshItem = THREE.getMesh('obj/wood_00.obj', materialWood, '00');
        this.element.add(meshItem);
    }

    remove(parent) {
        parent.render.scene.remove(this.element);
    }

    add(parent) {
        if(parent)
            parent.render.scene.add(this.element);
    }

}

require('../decorator').followPath(WoodCutter);
require('../decorator').playAnimation(WoodCutter);
require('../decorator').replaceMesh(WoodCutter);

module.exports = WoodCutter;
