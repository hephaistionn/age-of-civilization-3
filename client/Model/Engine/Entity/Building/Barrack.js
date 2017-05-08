const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Barrack extends Entity {

    constructor(params) {
        super(params);
    }
}

Barrack.selectable = true;
Barrack.description = 'This building increase the enable places for your population';
Barrack.tile_x = 1;
Barrack.tile_z = 1;
Barrack.walkable = 0;
Barrack.cost = {wood: 5, stone: 2};
Barrack.require = {inactive: 2};
Barrack.enabled = { population: 6};
Barrack.instances = [];

module.exports = Barrack;