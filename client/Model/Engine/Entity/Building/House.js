const Entity = require('../Entity');
const stateManager = require('../../../../services/stateManager');

class House extends Entity {

    constructor(params) {
        super(params);
        House.instances.push(this);
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
