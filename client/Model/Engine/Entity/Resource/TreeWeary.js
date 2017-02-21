const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class TreeWeary extends Entity {

    constructor(params) {
        super(params);
        TreeWeary.instances.push(this);
    }

    onRemove() {
        const index = TreeWeary.instances.indexOf(this);
        TreeWeary.instances.splice(index, 1);
    }

}
TreeWeary.selectable = false;
TreeWeary.tile_x = 1;
TreeWeary.tile_z = 1;
TreeWeary.walkable = 3;
TreeWeary.resource = false;
TreeWeary.instances = [];
module.exports = TreeWeary;
