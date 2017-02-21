const Entity = require('../Entity');

class Berry extends Entity {

    constructor(params) {
        super(params);
        this.berry = 100;
        this.exp = false;
        Berry.instances.push(this);
    }

    onRemove() {
        const index = Berry.instances.indexOf(this);
        Berry.instances.splice(index, 1);
    }

}
Berry.selectable = false;
Berry.tile_x = 1;
Berry.tile_z = 1;
Berry.walkable = 0;
Berry.code = 247; //value in alpha blue  246for png
Berry.resource = true;
Berry.instances = [];
module.exports = Berry;
