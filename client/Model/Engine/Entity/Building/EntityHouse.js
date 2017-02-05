const Entity = require('../Entity');
const stateManager = require('../../../../services/stateManager');

class EntityHouse extends Entity {

    constructor(params) {
        super(params);
        EntityHouse.instances.push(this);
    }

    onRemove() {
        const index = EntityHouse.instances.indexOf(this);
        EntityHouse.instances.splice(index, 1);
    }
}

EntityHouse.selectable = true;
EntityHouse.description = 'This building increase the enable places for your population';
EntityHouse.tile_x = 1;
EntityHouse.tile_z = 1;
EntityHouse.walkable = 0;
EntityHouse.cost = {wood: 20};
EntityHouse.require = {wood: 20};
EntityHouse.make = {population: 4};
EntityHouse.instances = [];

module.exports = EntityHouse;
