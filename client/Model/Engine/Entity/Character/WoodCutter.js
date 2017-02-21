const EntityCollector = require('../EntityCollector');

class WoodCutter extends EntityCollector {

    constructor(params) {
        super(params);
        this._capacity = 5;
        this._workDuration = 5000;
        this._speed = 0.001;
        this._targetType = 'Tree';
        WoodCutter.instances.push(this);
    }

    onRemove() {
        const index = WoodCutter.instances.indexOf(this);
        WoodCutter.instances.splice(index, 1);
    }
}

WoodCutter.selectable = true;
WoodCutter.description = 'I will go to an home to transmit my knowledge';
WoodCutter.instances = [];
WoodCutter.tile_x = 1;
WoodCutter.tile_z = 1;
module.exports = WoodCutter;
