const ENTITIES = require('./Entity/list');

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tileSize = config.tileSize;
        this.tileMaxHeight = config.tileMaxHeight;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.rotation = 0;
        this.removeMode = false;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
    }

    placeSelectedEntity(x, z, map) {

        const y = this.getHeightTile(x, z);

        this.selected.moveTo(x, z, y, this.rotation);

        const tiles = this.selected.getTiles();

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    getSelectedEntity() {
        if(this.selected && !this.undroppable) {
            return this.selected;
        }
    }

    selectEnity(id) {
        if(!this.selected || this.selected.constructor.name !== id) {
            this.selected = new ENTITIES[id](0, 0, 0, this.rotation);
        } else {
            this.selected = null;
        }
        this.rotation = 0;
        this.removeMode = false;
    }

    increaseRotation() {
        this.rotation += Math.PI / 2;
        if(this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }
    }

    removeEnable() {
        this.removeMode = !this.removeMode;
        this.selected = null;
    }

    dismount() {
        this.selected = null;
    }
};