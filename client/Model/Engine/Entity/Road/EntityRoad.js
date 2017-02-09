const stateManager = require('../../../../services/stateManager');

class EntityRoad {

    constructor(ground, saved) {
        this._ground = ground;
        this._grid = this._ground.grid;
        this.walkable = null;
        this.index = null;
        if(saved && saved.index) { //used when a map is reloaded
            const l = saved.index.length;
            this.index = new Uint16Array(saved.index);
            this.walkable = new Uint8Array(saved.walkable);
            for(let i = 0; i < l; i++) {
                this._grid.setWalkableAtByIndex(this.index[i], this.walkable[i]);
            }
        }
    }

    updateState(params) {
        if(!params) return;
        const tiles = params.tiles;
        const walkable = params.walkable;
        const l = params.length * 2;
        for(let i = 0; i < l; i += 2) {
            this._grid.setWalkableAt(tiles[i], tiles[i + 1], walkable[i / 2]);
        }
        const nodes = this._grid.getSpecialNodes();
        this.walkable = new Uint8Array(nodes.walkable);
        this.index = new Uint16Array(nodes.index);
        this.updated = true;
    }

    pullState(newRoad) {
        const cost = EntityRoad.roads[newRoad.type].cost;
        const states = stateManager.currentCity.states;
        for(var resourceId in cost) {
            const valueRequired = cost[resourceId] * newRoad.length;
            states[resourceId] -= valueRequired;
        }
    }

    getSavedModel() {
        if(this.index && this.index.length) {
            return {
                index: Array.from(this.index),
                walkable: Array.from(this.walkable)
            }
        } else {
            return null;
        }
    }
}

EntityRoad.available = function available(type, size) {
    const require = EntityRoad.roads[type].require;
    const cost = EntityRoad.roads[type].cost;
    for(let prop in require) {
        if(require[prop] > stateManager[prop]) {
            return false;
        }
    }
    if(size) {
        for(let prop in cost) {
            const valueRequired = cost[prop] * (size || 1);
            if(valueRequired > stateManager[prop]) {
                return false;
            }
        }
    }
    return true;
};

EntityRoad.walkable = true;
EntityRoad.roads = {
    dirtRoad: {cost: {stone: 1}, require: {population: 4}, code: 2},
    stoneRoad: {cost: {stone: 2}, require: {population: 16}, code: 3},
    tileRoad: {cost: {stone: 4}, require: {population: 30}, code: 4}
};
module.exports = EntityRoad;
