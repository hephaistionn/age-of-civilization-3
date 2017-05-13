const Shape = require('../../../services/shape');
const config = require('../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const THREE = require('three');

class Entity {

    constructor(model, parent, materialForce) {
        this.model = model;
        this.element = new THREE.Object3D();
        this.element.matrixAutoUpdate = false;
        this.element.frustumCulled = false;
        this.initMesh(model, materialForce);
        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {
        this.updateMesh(model);
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];

    }

    updateMesh(){

    }

    addMesh(mesh){
        this.element.add(mesh);
        mesh.matrixWorld = this.element.matrixWorld;
    }

    removeMesh(mesh){
        this.element.remove(mesh);
    }

    remove(parent) {
        parent.render.scene.remove(this.element);
    }

    add(parent) {
        if(parent)
            parent.render.scene.add(this.element);
    }
}


module.exports = Entity;
