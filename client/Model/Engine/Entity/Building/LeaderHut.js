const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class LeaderHut extends Entity {

    constructor(params) {
        super(params);
    }
}

LeaderHut.selectable = true;
LeaderHut.description = 'This building increase the enable places for your population';
LeaderHut.tile_x = 1;
LeaderHut.tile_z = 1;
LeaderHut.walkable = 0;
LeaderHut.cost = {wood: 5};
LeaderHut.require = {inactive: 2};
LeaderHut.enabled = { population: 6};
LeaderHut.make = {};
LeaderHut.instances = [];

module.exports = LeaderHut;