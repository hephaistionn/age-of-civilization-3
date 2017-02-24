const EntityCarrier = require('../EntityCarrier');
const pathfinding = require('../../../../services/pathfinding');

class Peon extends EntityCarrier {

    constructor(params) {
        super(params);
        this._capacity = 5;
        this._speed = 0.001;
        this._targetType = 'Market';
    }
}

Peon.selectable = true;
Peon.description = 'I will go to an home to transmit my knowledge';
Peon.instances = [];
Peon.tile_x = 1;
Peon.tile_z = 1;
module.exports = Peon;
