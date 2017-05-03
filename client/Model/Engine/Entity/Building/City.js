const stateManager = require('../../../../services/stateManager');

class City {

    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;
        this.level = params.level || 0;
        this.geo = params.geo || 'mesopotamia';
        this.name = params.name || 'no name';
        this.leader = params.leader || 'free';
        this.cityId = params.id;
        this.desc = params.desc; 
        this.goal = params.goal; 
        City.instances.push(this);
    }

    updateState(model) {
        this.level = model.level;
    }

    onRemove() {
        const index = City.instances.indexOf(this);
        City.instances.splice(index, 1);
    }
}

City.selectable = true;
City.instances = [];  
City.tile_x = 1;
City.tile_z = 1;

module.exports = City;