const Entity = require('../Entity.js');
const stateManager = require('../../../../services/stateManager');

class EntityHouse extends Entity {

    constructor(params) {
        super(params);
        this.population = EntityHouse.make.population; //params.population || 4;
    }

    onConstruct() {
    }

}

EntityHouse.selectable = true;
EntityHouse.description = 'This building increase the enable places for your population';
EntityHouse.tile_x = 1;
EntityHouse.tile_z = 1;
EntityHouse.walkable = false;
EntityHouse.cost = {wood: 20};
EntityHouse.require = {wood: 20};
EntityHouse.make = {population: 4};

module.exports = EntityHouse;
