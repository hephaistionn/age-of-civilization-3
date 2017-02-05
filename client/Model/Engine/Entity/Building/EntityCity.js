const stateManager = require('../../../../services/stateManager');

class EntityCity {

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
        EntityCity.instances.push(this);
    }

    updateState(model) {
        this.level = model.level;
    }

    onRemove() {
        const index = EntityCity.instances.indexOf(this);
        EntityCity.instances.splice(index, 1);
    }
}

EntityCity.selectable = true;
EntityCity.description = 'This is a City';
EntityCity.instances = [];
EntityCity.tile_x = 1;
EntityCity.tile_z = 1;

module.exports = EntityCity;