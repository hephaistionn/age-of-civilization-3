const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class TreeWeary extends Entity {

    initMesh(model, materialForce) {
        this.element = THREE.getMesh('obj/treeWeary_00.obj', materialForce || material, model._id);
    }

};
