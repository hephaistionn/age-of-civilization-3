const EntityWorker = require('../EntityWorker');
const pathfinding = require('../../../../services/pathfinding');

class Trader extends EntityWorker {

    constructor(params) {
        super(params);
        this._maxStep = 2;
        this._cycleDuration = 5000;
        Trader.instances.push(this);
    }

    onRemove() {
        const index = Trader.instances.indexOf(this);
        Trader.instances.splice(index, 1);
    }
}

Trader.selectable = true;
Trader.description = 'I will go to an home to transmit my knowledge';
Trader.instances = [];
Trader.tile_x = 1;
Trader.tile_z = 1;
module.exports = Trader;
