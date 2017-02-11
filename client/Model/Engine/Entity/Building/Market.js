const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');
const stateManager = require('../../../../services/stateManager');

class Market extends Entity {

    constructor(params) {
        super(params);
        this.power = params.power || 0;
        this._cycle = params._cycle || 2000;
        this.timer = params.timer || 0;
        Market.instances.push(this);
    }

    update() {
        this.power += 1;
        if(this.power >= 2) {

            ee.emit('newEntity', {
                power: 5,
                x: this.x,
                y: this.y,
                z: this.z,
                a: 0,
                target: 'House',
                source: this,
                type: 'Peon'
            });
            this.power = 0;
        }
    }

    onRemove() {
        const index = Market.instances.indexOf(this);
        Market.instances.splice(index, 1);
    }

}

Market.selectable = true;
Market.description = 'This building increase the prosperity of your city';
Market.tile_x = 2;
Market.tile_z = 1;
Market.cost = {wood: 5, stone: 5};
Market.require = {population: 4, wood: 5, stone: 5};
Market.make = {workers: 4, population: -4};
Market.walkable = 0;
Market.instances = [];
module.exports = Market;
