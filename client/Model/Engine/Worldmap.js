const City = require('./Entity/Building/City');

class Worldmap {

    constructor(config) {
        this.nbPointX = config.nbPointX;
        this.nbPointZ = config.nbPointZ;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.pointsHeights = config.pointsHeights;
        this.pointsNormal = config.pointsNormal;
        this.tilesHeight = config.tilesHeight;
        this.tilesTilt = config.tilesTilt;
        this.tilesColor = config.tilesColor;
        this.canvasColor = config.canvas;
        this.areaTiles = config.areaTiles;
        this.citySpawns = config.citySpawns;
        this.tiltMax = 40;
        this.updated = false;
        this._id = 2;
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 55;
    }

    updateAreaMap(cities) {
        const controlled = [];
        const free = [];

        for(let i = 0; i < cities.length; i++) {
            const city = cities[i];
            if(city.level > 0) {
                controlled.push(i + 1);
            } else {
                free.push(i + 1);
            }
        }

        const data = this.areaTiles;
        const length = data.length;
        let codeArea;
        for(let i = 0; i < length; i = i + 4) {
            codeArea = data[i];
            if(controlled.indexOf(codeArea) !== -1) {
                data[i + 1] = 255;
            } else if(free.indexOf(codeArea) !== -1) {
                data[i + 1] = 153;
            } else {
                data[i + 1] = 50;
            }
        }

        this.updated = true;
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Worldmap;
