const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class House extends Entity {

    constructor(params) {
        super(params);
        this.time = params.time || 0;
        this.cycle = params.cycle || 2000;
        this.timer = params.timer || 0;
        this.states = { population: 4};
    }

    update() {
        this.time += 1;
        if(this.time >= 10) {
            ee.emit('newEntity', {wood: 0, sourceId: this._id, type: 'Peon'});
            this.time = 0;
        }
    }

    getData() {
        return {
            population: 2
        }
    }
}

House.selectable = true;
House.description = 'This building increase the enable places for your population';
House.tile_x = 1;
House.tile_z = 1;
House.walkable = 0;
House.cost = {wood: 20, stone: 1};
House.require = {};
House.enabled = {};
House.constuctDuration = 1000;
House.instances = [];

module.exports = House;
