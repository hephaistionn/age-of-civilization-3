const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const THREE = require('three');
const material = require('../../Material/materialA');
const Entity = require('../Entity');

module.exports = class City extends Entity {


    initMesh(model, materialForce) {
        this.updateMesh(model); 
    }

    updateMesh(model){
        let  path; //// path = path.replace('@1', model.geo).replace('@2', model.level);
        switch(model.level) {
            case 1:
                path = 'obj/cityA.obj';
                break;
            default :
                path = 'obj/flagA.obj';
        }
        this.removeMesh(this.element.children[0])
        this.addMesh(THREE.getMesh(path, material, model._id));    
    }

};
