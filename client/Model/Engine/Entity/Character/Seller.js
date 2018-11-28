const EntityWorker = require('../EntityWorker');
const pathfinding = require('../../../../services/pathfinding');

class Seller extends EntityWorker {

    constructor(params) {
        super(params);
        this._maxStep = 2;
        this._cycleDuration = 5000;
    }

}

Seller.selectable = true;
Seller.description = 'I will go to an home to transmit my knowledge';
Seller.instances = [];
Seller.tile_x = 1;
Seller.tile_z = 1;
module.exports = Seller;
