const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class HunterHut extends Entity {

    constructor(params) {
        super(params);
    }
}

HunterHut.selectable = true;
HunterHut.description = 'This building increase the enable places for your population';
HunterHut.tile_x = 1;
HunterHut.tile_z = 1;
HunterHut.walkable = 0;
HunterHut.cost = {wood: 5};
HunterHut.require = {inactive: 2};
HunterHut.enabled = { population: 4};
HunterHut.instances = [];

module.exports = HunterHut;