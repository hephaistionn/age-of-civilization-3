const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Starter extends Entity {

    constructor(params) {
        super(params);
        this.states = { wood: 200, stone: 50};
    }
}

Entity.description = 'This building increase the enable places for your population';
Entity.tile_x = 1;
Entity.tile_z = 1;
Entity.walkable = 0;
Entity.cost = {};
Entity.require = {};
Entity.enabled = {};
Entity.instances = [];

module.exports = Starter;
