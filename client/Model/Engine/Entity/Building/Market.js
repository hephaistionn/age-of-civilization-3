const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');
const stateManager = require('../../../../services/stateManager');

class Market extends Entity {

    constructor(params) {
        super(params);
        this.food = params.food || 0;
        ee.emit('newEntity', {sourceId: this._id, type: 'Trader'});
    }

    store(value) {
        this.food += value;
    }

    getWorkerSlot(step) {
        const x = this.x + (step === 2 ? 0.2 : 0);
        const z = this.z + 0.4;
        return {x: x, y: this.y, z: z, a: Math.PI / 2}
    }

}

Market.selectable = true;
Market.description = 'This building increase the prosperity of your city';
Market.tile_x = 1;
Market.tile_z = 1;
Market.cost = {wood: 5, stone: 5};
Market.require = {population: 4, wood: 5, stone: 5};
Market.make = {workers: 4, population: -4};
Market.walkable = 0;
Market.instances = [];
module.exports = Market;
