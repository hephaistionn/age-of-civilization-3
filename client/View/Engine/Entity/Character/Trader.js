const Shape = require('../../../../services/shape');
const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialB');
const materialWood = require('../../Material/materialA');
const THREE = require('three');

const animations = {
    work: {duration: 5000, steps: new Uint8Array([0, 0, 1, 1, 0, 0])}
};

class Trader {

    constructor(model, parent) {
        this.model = model;
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.element.name = 'Trader';
        this.add(parent);
        this.loadMesh(model);
        this.animations = animations;
        this.currentAnimation = 'work';
        this.updateState(model);

    }

    update(dt) {
        this.playAnimation(dt);
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
        this.element.children[0].matrixWorld = this.element.matrixWorld;
    }

    loadMesh(model) {
        const mesh = THREE.getMesh('obj/unityA/unityA.obj', material);
        mesh.userData.id = model.id;
        mesh.frustumCulled = false;
        mesh.matrixAutoUpdate = false;
        mesh.castShadow = true;
        mesh.name = model.constructor.name;
        this.element.add(mesh)
    }

    remove(parent) {
        parent.render.scene.remove(this.element);
    }

    add(parent) {
        if(parent)
            parent.render.scene.add(this.element);
    }
}

require('../decorator').playAnimation(Trader);

module.exports = Trader;
