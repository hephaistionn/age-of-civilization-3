const Entity = require('../Entity');

class Tree extends Entity {

    constructor(params) {
        super(params);
        this.wood = 100;
        this.exp = false;
        Tree.instances.push(this);
    }

    onRemove() {
        const index = Tree.instances.indexOf(this);
        Tree.instances.splice(index, 1);
    }

}
Tree.selectable = false;
Tree.tile_x = 1;
Tree.tile_z = 1;
Tree.walkable = 0;
Tree.code = 255; //value in alpha blue
Tree.resource = true;
Tree.instances = [];
module.exports = Tree;
