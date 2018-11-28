const EntityCarrier = require('../EntityCarrier');

class WoodCarrier extends EntityCarrier {

    constructor(params) {
        console.log('---WoodCarrier')
        super(params);
        this._capacity = 5;
        this._workDuration = 5000;
        this._speed = 0.001;
        this._targetType = 'Repository';
        this.ressourceId = 'wood';
    }

}

WoodCarrier.selectable = true;
WoodCarrier.description = 'I will go to an home to transmit my knowledge';
WoodCarrier.instances = [];
WoodCarrier.tile_x = 1;
WoodCarrier.tile_z = 1;
WoodCarrier.authorizedTile = 1;
module.exports = WoodCarrier;
