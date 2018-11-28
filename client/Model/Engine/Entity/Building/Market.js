const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Market extends Entity {

    constructor(params) {
        super(params);
        this.food = params.food || 0;
        ee.emit('newEntity', {sourceId: this._id, type: 'Seller'});
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
Market.require = {inactive: 2};
Market.enabled = {wood: 5, population: 4};
Market.walkable = 0;
Market.constuctDuration = 1000;
Market.instances = [];
module.exports = Market;
