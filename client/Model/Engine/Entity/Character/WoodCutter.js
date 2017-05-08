const EntityCollector = require('../EntityCollector');

class WoodCutter extends EntityCollector {

    constructor(params) {
        super(params);
        this._capacity = 5;
        this._workDuration = 5000;
        this._speed = 0.001;
        this._targetType = 'Tree';
        this.ressourceId = 'wood';
    }

}

WoodCutter.selectable = true;
WoodCutter.description = 'I will go to an home to transmit my knowledge';
WoodCutter.instances = [];
WoodCutter.tile_x = 1;
WoodCutter.tile_z = 1;
WoodCutter.authorizedTile = 2;
module.exports = WoodCutter;
