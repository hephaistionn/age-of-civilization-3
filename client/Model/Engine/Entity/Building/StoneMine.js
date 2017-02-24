const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class StoneMine extends Entity {

    constructor(params) {
        super(params);
    }
}

StoneMine.selectable = true;
StoneMine.description = 'This building increase the enable places for your population';
StoneMine.tile_x = 1;
StoneMine.tile_z = 1;
StoneMine.walkable = 0;
StoneMine.cost = {wood: 5};
StoneMine.require = {wood: 5};
StoneMine.make = {};
StoneMine.instances = [];

module.exports = StoneMine;