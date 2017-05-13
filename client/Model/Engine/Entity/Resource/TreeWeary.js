const Entity = require('../EntityBasic');
const ee = require('../../../../services/eventEmitter');

class TreeWeary extends Entity {

    constructor(params) {
        super(params);
    }
}
TreeWeary.selectable = false;
TreeWeary.tile_x = 1;
TreeWeary.tile_z = 1;
TreeWeary.walkable = 3;
TreeWeary.resource = false;
TreeWeary.instances = [];
module.exports = TreeWeary;
