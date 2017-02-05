const pathfinding = require('../../services/pathfinding');
const ENTITIES = require('./Entity/listEntity');

class Ground {

    constructor(config) {

        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.tiltMax = config.tiltMax || 50;
        this.pointsHeights = config.pointsHeights;
        this.pointsNormal = config.pointsNormal;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesColor = config.tilesColor;
        this.canvasColor = config.canvas;
        this.grid = new pathfinding.Grid(this.nbTileX, this.nbTileZ, 1);
        this.updated = false;
        this._id = 2;
        this.initGridByHeight(this.tilesTilt);
    }

    initGridByHeight() {
        let length = this.tilesTilt.length;
        for(let i = 0; i < length; i++) {
            let x = i % this.nbTileX;
            let z = Math.floor(i / this.nbTileX);
            let tilt = this.tilesTilt[i];
            let height = this.tilesHeight[i];
            if(tilt > this.tiltMax) {
                this.grid.setWalkableAt(x, z, 0);
            } else if(height < 41) {
                this.grid.setWalkableAt(x, z, 0);
            }
        }
    }

    setWalkableTile(entity, walkableStatus) {
        const tiles = entity.getTiles();
        for(let i = 0; i < tiles.length; i += 2) {
            this.grid.setWalkableAt(tiles[i], tiles[i + 1], walkableStatus || entity.walkable);
        }
        this.updated = true;
    }

    isWalkable(x, z) {
        if(x.length) {
            for(let i = 0; i < x.length; i += 2) {
                if(!this.grid.isWalkableAt(x[i], x[i + 1])) {
                    return false;
                }
            }
            return true;
        } else {
            return this.grid.isWalkableAt(x, z) ? true : false;
        }
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    update(dt) {

    }

    dismount() {

    }

}

module.exports = Ground;
