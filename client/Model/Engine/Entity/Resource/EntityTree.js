const Entity = require('../Entity.js');

class EntityTree extends Entity {

    constructor(x, z, y, a) {
        super(x, z, y, a);
        this.wood = 100;
    }

}

EntityTree.tile_x = 1;
EntityTree.tile_z = 1;
EntityTree.walkable = false;
module.exports = EntityTree;