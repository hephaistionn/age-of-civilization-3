const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class Tree extends Entity {

    initMesh(model, materialForce) {
        this.element = THREE.getMesh('obj/tree_00.obj', materialForce || material, model._id);
    }

};
