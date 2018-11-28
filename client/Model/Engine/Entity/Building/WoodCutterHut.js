const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class WoodCutterHut extends Entity {

    constructor(params) {
        super(params);
        this.states =  {} 
        this.states.wood =  params.states&&params.states.wood ?  params.states.wood : 0;
        this.states.workers =  2;
        this.statesMax = { wood: 20};

        this.workers = params.workers || 0;
        this.WorkersMax = 1;

        this.cycle = params.cycle || 2000;
        this.timer = params.timer || 0;
 
    }

    update() {
        if(this.builded && this.workers < this.WorkersMax) {
            ee.emit('newEntity', {sourceId: this._id, type: 'WoodCutter'});
            this.workers++;
        }
        if(this.builded && this.states.wood >= this.statesMax.wood) {
            ee.emit('newEntity', {sourceId: this._id, type: 'WoodCarrier'});
        }
    }
}

WoodCutterHut.selectable = true;
WoodCutterHut.description = 'This building increase the prosperity of your city';
WoodCutterHut.tile_x = 1;
WoodCutterHut.tile_z = 1;
WoodCutterHut.cost = {stone: 2};
WoodCutterHut.require = {inactive: 2};
WoodCutterHut.enabled = {stone: 2};
WoodCutterHut.displayed = ['workers', 'wood'];
WoodCutterHut.walkable = 0;
WoodCutterHut.constuctDuration = 1000;
WoodCutterHut.instances = [];
module.exports = WoodCutterHut;
