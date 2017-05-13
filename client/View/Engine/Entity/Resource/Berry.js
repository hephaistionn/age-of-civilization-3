const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class Berry extends Entity {

    initMesh(model, materialForce) {
    	this.berry = THREE.getMesh('obj/berry_00.obj', materialForce || material, model._id);
    	this.updateMesh(model);	
    }

    updateMesh(model){
		this.addMesh(this.berry);
    }

};
