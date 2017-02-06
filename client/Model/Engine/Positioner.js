const ENTITIES = require('./Entity/listEntity');

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
        this.updated = false;
        this.id = 3;
    }

    moveEntity(x, z, ground) {
        if(!this.selected) return;
        this.x = x;
        this.z = z;
        const y = ground.getHeightTile(x, z);
        this.selected.move(x, y, z);
        const tiles = this.selected.getTiles();
        this.undroppable = !ground.isWalkable(tiles);
        this.updated = true;
    }

    rotate(){
        if(!this.selected) return;
        this.selected.a += Math.PI / 2;
        if(this.selected.a >= Math.PI * 2) this.selected.a = 0;
        this.updated = true;
    }

    selectEntity(id) {
        if(!ENTITIES[id]) return;
        this.selected = new ENTITIES[id]({x: 0, y: 0, z: 0, a: 0});
        this.updated = true;
    }

    getSelectEntity() {
        if(this.selected && !this.undroppable && ENTITIES[this.selected.constructor.name].available()) {
            return {
                x: this.selected.x,
                z: this.selected.z,
                y: this.selected.y,
                a: this.selected.a,
                type: this.selected.constructor.name
            }
        }
    }

    unselectEntity() {
        if(!this.selected) return;
        this.selected.onRemove();
        this.selected = null;
        this.updated = true;
    }

    dismount() {
        this.selected = null;
    }
};
