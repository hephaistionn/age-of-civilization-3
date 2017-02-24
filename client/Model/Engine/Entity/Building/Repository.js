const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Repository extends Entity {

    constructor(params) {
        super(params);
    }
}

Repository.selectable = true;
Repository.description = 'This building increase the enable places for your population';
Repository.tile_x = 1;
Repository.tile_z = 1;
Repository.walkable = 0;
Repository.cost = {wood: 5};
Repository.require = {wood: 5};
Repository.make = {};
Repository.instances = [];

module.exports = Repository;