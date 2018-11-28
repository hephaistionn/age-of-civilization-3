const EntityBasic = require('../EntityBasic');

class Stone extends EntityBasic {

    constructor(params) {
        super(params);
        this.stone = 100;
        this.exp = false;
    }
}
Stone.selectable = false;
Stone.tile_x = 1;
Stone.tile_z = 1;
Stone.walkable = 0;
Stone.code = 253;
Stone.resource = true;
Stone.instances = [];
module.exports = Stone;
