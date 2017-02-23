const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class Stone extends Entity {

    initMesh(model, materialForce) {
        this.element = THREE.getMesh('obj/stone_00.obj', materialForce || material, model._id);
    }

};
