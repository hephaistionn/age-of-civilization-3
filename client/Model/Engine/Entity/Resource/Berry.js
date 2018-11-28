const EntityBasic = require('../EntityBasic');

class Berry extends EntityBasic {

    constructor(params) {
        super(params);
        this.berry = 100;
        this.exp = false;
    }
}
Berry.selectable = false;
Berry.tile_x = 1;
Berry.tile_z = 1;
Berry.walkable = 0;
Berry.code = 251;
Berry.resource = true;
Berry.instances = [];
module.exports = Berry;
