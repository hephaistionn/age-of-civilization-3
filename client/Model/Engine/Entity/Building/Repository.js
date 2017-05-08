const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Repository extends Entity {

    constructor(params) {
        super(params);
        this.states = { wood: 0, stone: 0, workers: 2 };
        this.statesMax = { wood: 300, stone: 300 };
        this.capacity = 600;
    }
}

Repository.selectable = true;
Repository.description = 'This building increase the enable places for your population';
Repository.tile_x = 1;
Repository.tile_z = 1;
Repository.walkable = 0;
Repository.cost = {wood: 5};
Repository.require = {inactive: 2}; 
Repository.enabled = {wood: 5};
Repository.displayed = ['wood', 'stone'];
Repository.instances = [];

module.exports = Repository;