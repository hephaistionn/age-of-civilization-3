const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');
const stateManager = require('../../../../services/stateManager');

class WoodCutterHut extends Entity {

    constructor(params) {
        super(params);
        this.wood = params.wood || 0;
        this.workers = params.workers || 0;
        this.cycle = params.cycle || 2000;
        this.timer = params.timer || 0;
        WoodCutterHut.instances.push(this);
    }

    update() {
        if(this.workers === 0) {
            ee.emit('newEntity', {sourceId: this._id, type: 'WoodCutter'});
            this.workers++;
        }
    }

    store(value) {
        this.workers--;
        this.timer = 0;
        this.wood += value;
    }

    onRemove() {
        const index = WoodCutterHut.instances.indexOf(this);
        WoodCutterHut.instances.splice(index, 1);
    }

}

WoodCutterHut.selectable = true;
WoodCutterHut.description = 'This building increase the prosperity of your city';
WoodCutterHut.tile_x = 1;
WoodCutterHut.tile_z = 1;
WoodCutterHut.cost = {stone: 2};
WoodCutterHut.require = {stone: 2};
WoodCutterHut.make = {workers: 2, population: -2};
WoodCutterHut.walkable = 0;
WoodCutterHut.instances = [];
module.exports = WoodCutterHut;
