const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const THREE = require('three');
const material = require('../../Material/materialA');
const Entity = require('../Entity');

module.exports = class City extends Entity {

    initMesh(model) {
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
    }

    updateMesh(model) {
        let path; // path = path.replace('@1', model.geo).replace('@2', model.level);
        switch(this.model.level) {
            case 1:
                path = 'obj/cityA.obj';
                break;
            default :
                path = 'obj/flagA.obj';
        }
        this.element.remove(this.element.children[0]);
        this.element.add(new THREE.getMesh(path, material, model._id));
    }

    updateState() {
        this.level = this.model.level;
        this.updateMesh(this.model);
        const matrixWorld = this.element.children[0].matrixWorld.elements;
        matrixWorld[12] = this.model.x * tileSize;
        matrixWorld[14] = this.model.z * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }

};
