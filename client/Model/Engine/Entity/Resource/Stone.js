const Entity = require('../Entity');

class Stone extends Entity {

    constructor(params) {
        super(params);
        this.stone = 100;
        this.exp = false;
        Stone.instances.push(this);
    }

    onRemove() {
        const index = Stone.instances.indexOf(this);
        Stone.instances.splice(index, 1);
    }

}
Stone.selectable = false;
Stone.tile_x = 1;
Stone.tile_z = 1;
Stone.walkable = 0;
Stone.code = 253; //value in alpha blue  252  for png
Stone.resource = true;
Stone.instances = [];
module.exports = Stone;
