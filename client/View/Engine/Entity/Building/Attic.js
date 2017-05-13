const material = require('../../Material/materialA');
const THREE = require('three');
const Entity = require('../Entity');

module.exports = class House extends Entity {

    initMesh(model, materialForce) {
    	this.building = THREE.getMesh('obj/attic_00.obj', materialForce || material, model._id);
    	this.foundation  = THREE.getMesh('obj/repository_00.obj', material, model._id);
    	this.updateMesh(model);	
    }

    updateMesh(model){
		if(model.builded){
			this.removeMesh(this.foundation);
			this.addMesh(this.building);
    	}else{
    		this.removeMesh(this.building);
    		this.addMesh(this.foundation);
    	}
    }

};