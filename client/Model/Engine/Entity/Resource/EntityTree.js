const Entity = require('../Entity');

class EntityTree extends Entity {

    constructor(params) {
        super(params);
        this.wood = 100;
        this.exp = false;
        EntityTree.instances.push(this);
    }

    onRemove() {
        const index = EntityTree.instances.indexOf(this);
        EntityTree.instances.splice(index, 1);
    }

}
EntityTree.selectable = false;
EntityTree.tile_x = 1;
EntityTree.tile_z = 1;
EntityTree.walkable = 0;
EntityTree.code = 255; //value in alpha blue
EntityTree.resource = true;
EntityTree.instances = [];
module.exports = EntityTree;
