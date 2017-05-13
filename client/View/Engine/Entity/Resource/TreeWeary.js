const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class TreeWeary extends Entity {

    initMesh(model, materialForce) {
    	this.tree = THREE.getMesh('obj/treeWeary_00.obj', materialForce || material, model._id);
    	this.updateMesh(model);	
    }

    updateMesh(model){
		this.addMesh(this.tree);
    }


};
