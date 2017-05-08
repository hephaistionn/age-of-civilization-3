const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Attic extends Entity {

    constructor(params) {
        super(params);
    }
}

Attic.selectable = true;
Attic.description = 'This building increase the enable places for your population';
Attic.tile_x = 1;
Attic.tile_z = 1;
Attic.walkable = 0;
Attic.cost = {wood: 5};
Attic.require = {inactive: 2};
Attic.enabled = { population: 4};
Attic.instances = [];

module.exports = Attic;
