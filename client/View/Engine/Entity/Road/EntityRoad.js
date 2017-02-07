const THREE = require('../../../../services/threejs');
const config = require('../../config');
const materialGround = require('../../Material/materialGround');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const GROUND = 2;

class EntityRoad {

    constructor(model) {
        this.model = model;
        this.canvasColor = this.model._ground.canvasColor;

        this.materialGround = materialGround;
        this.getOriginMap(model);
        this.initRoadMap(model);
        this.materialGround.uniforms.texture.value = THREE.loadTexture(this.cavasRoad);
        this.updateState(model);
    }

    getOriginMap(model) {
        this.contextColor = this.canvasColor.getContext('2d');
        this.contextColor.width = this.canvasColor.width;
        this.contextColor.height = this.canvasColor.height;
        this.imageColor = this.contextColor.getImageData(0, 0, this.contextColor.width, this.contextColor.height);
    }

    initRoadMap(model) {
        this.cavasRoad = document.createElement('canvas');
        this.cavasRoad.width = this.canvasColor.width;
        this.cavasRoad.height = this.canvasColor.height;
        this.contextRoad = this.cavasRoad.getContext('2d');
        this.contextRoad.width = this.canvasColor.width;
        this.contextRoad.height = this.canvasColor.height;
        this.imageRoad = this.contextRoad.getImageData(0, 0, this.cavasRoad.width, this.contextRoad.height);
    }

    updateState(model) {
        const l1 = this.imageColor.data.length;
        for(let i = 0; i < l1; i++) {
            this.imageRoad.data[i] = this.imageColor.data[i];
        }

        if(model.index) {
            debugger;
            const grid = model._grid;
            const nodes = grid.nodes;
            const index = model.index;
            const walkable = model.walkable;
            const nbX = model._ground.nbTileX + 1;
            const l2 = model.index.length;
            for(let k = 0; k < l2; k++) {

                const x = nodes[index[k]];
                const z = nodes[index[k] + 1];
                const i = (x + z * nbX) * 4;
                const factor = (x % 2 === 1 && z % 2 === 0 || x % 2 === 0 && z % 2 === 1) ? 0.9 : 1;

                if(walkable[k] === 2) {
                    this.imageRoad.data[i] = 131 * factor;
                    this.imageRoad.data[i + 1] = 135 * factor;
                    this.imageRoad.data[i + 2] = 135 * factor;
                } else if(walkable[k] === 3) {
                    this.imageRoad.data[i] = 120 * factor;
                    this.imageRoad.data[i + 1] = 117 * factor;
                    this.imageRoad.data[i + 2] = 36 * factor;
                }
            }
        }

        this.contextRoad.putImageData(this.imageRoad, 0, 0);
        this.materialGround.uniforms.texture.value.needsUpdate = true;
    }

    remove(parent) {

    }
}
module.exports = EntityRoad;
