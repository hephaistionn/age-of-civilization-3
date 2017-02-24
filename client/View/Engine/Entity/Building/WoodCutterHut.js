const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class WoodCutterHut extends Entity {

    initMesh(model, materialForce) {
        this.element = THREE.getMesh('obj/woodCutterHut_00.obj', materialForce || material, model._id);
    }
};
