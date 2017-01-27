const pathfinding = require('../../services/pathfinding');
const EntityCity = require('./Entity/Building/EntityCity');

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
        this.cities = [];
        this.updatedCity = [];
        this.tiltMax = 40;
        this.heightMin = 0.16;
        this.updated = false;
    }

    addOrUpdateCity(params) {
        const existingcity = this.cities.find(city => city.id === params.id);
        if(!existingcity){
            params.y = this.getHeightTile(params.x, params.z);
            const city = new EntityCity(params);
            this.cities.push(city);
            this.updateAreaMap();
        }else{
            existingcity.updateState(params);
            this.updatedCity.push(existingcity);
        }
        this.updated = true;
    }

    removeCity(city) {
        let index = this.cities.indexOf(city);
        this.cities.splice(index, 1);
        this.updated = true;
    }


    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    updateAreaMap() {
        const controlled = [];
        const free = [];

        for(let i = 0; i < this.cities.length; i++) {
            const city = this.cities[i];
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
    }

    update(dt) {

    }

    dismount() {

    }
}

module.exports = Worldmap;
