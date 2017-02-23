const Entity = require('../Entity');
const stateManager = require('../../../../services/stateManager');
const ee = require('../../../../services/eventEmitter');

class House extends Entity {

    constructor(params) {
        super(params);
        this.time = params.time || 0;
        this.cycle = params.cycle || 2000;
        this.timer = params.timer || 0;
        House.instances.push(this);
    }

    update() {
        this.time += 1;
        if(this.time >= 10) {
            ee.emit('newEntity', {wood: 0, sourceId: this._id, type: 'Peon'});
            this.time = 0;
        }
    }

    onRemove() {
        const index = House.instances.indexOf(this);
        House.instances.splice(index, 1);
    }
}

House.selectable = true;
House.description = 'This building increase the enable places for your population';
House.tile_x = 1;
House.tile_z = 1;
House.walkable = 0;
House.cost = {wood: 20};
House.require = {wood: 20};
House.make = {population: 4};
House.instances = [];

module.exports = House;