const stateManager = require('../../../services/stateManager');

class Entity {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this._id = parseInt(params._id, 10);
        this.move(params.x || 0, params.y || 0, params.z || 0, params.a || 0);
        this.constructor.instances.push(this);
    }

    move(x, y, z, a) {

        if(a !== undefined) {
            this.a = a;
        }

        let xNbTile = this.constructor.tile_x;
        let zNbTile = this.constructor.tile_z;

        if(this.a !== 0 && this.a !== Math.PI) {
            xNbTile = this.constructor.tile_z;
            zNbTile = this.constructor.tile_x;
        }

        const xFirstTile = Math.round((x - xNbTile / 2));
        const zFirstTile = Math.round((z - zNbTile / 2));

        this.x = xFirstTile + xNbTile / 2;
        this.z = zFirstTile + zNbTile / 2;
        this.y = y;
    }

    moveFree(x, y, z, a) {
        this.a = a;
        this.x = x;
        this.z = z;
        this.y = y;
    }

    getTiles() {
        let xNbTile = this.constructor.tile_x;
        let zNbTile = this.constructor.tile_z;

        if(this.a !== 0 && this.a !== Math.PI) {
            xNbTile = this.constructor.tile_z;
            zNbTile = this.constructor.tile_x;
        }

        const xFirstTile = this.x - xNbTile / 2;
        const zFirstTile = this.z - zNbTile / 2;
        const xLastTile = xFirstTile + xNbTile;
        const zLastTile = zFirstTile + zNbTile;

        const tiles = [];
        for(let xi = xFirstTile; xi < xLastTile; xi++) {
            for(let zi = zFirstTile; zi < zLastTile; zi++) {
                tiles.push(xi);
                tiles.push(zi);
            }
        }
        return tiles;
    }

    updateTimer(dt) {
        this.timer += dt;
        if(this.timer > this.cycle) {
            this.update();
            this.timer = 0;
        }
    }

    pullState() {
        let eleId;
        const cost = this.constructor.cost;
        const make = this.constructor.make;
        const states = stateManager.currentCity.states;

        for(eleId in cost) {
            states[eleId] -= cost[eleId];
        }

        for(eleId in make) {
            states[eleId] += make[eleId];
        }
    }

    restoreState() {
        let eleId;
        const make = this.constructor.make;
        const cost = this.constructor.cost;
        const states = stateManager.currentCity.states;

        for(eleId in make) {
            states[eleId] -= make[eleId];
        }

        for(eleId in cost) {
            states[eleId] += cost[eleId];
        }
    }

    onRemove() {
        const index = this.constructor.instances.indexOf(this);
        this.constructor.instances.splice(index, 1);
    }

}

Entity.checkState= function checkState() {
    let eleId;
    const cost = this.cost;
    const states = stateManager.currentCity.states;
    const required =  new Map();
    for(eleId in cost) {
        if(states[eleId] < cost[eleId]){
            required.set(eleId,  cost[eleId]);
        }
    }
    return required;
};

Entity.available = function available() {
    const require = this.require;
    const states = stateManager.currentCity.states;
    for(var stateId in require) {
        if(require[stateId] > states[stateId]) {
            return false;
        }
    }
    return true;
};

Entity.getNearestEntities = function getNearestEntities(x, z, max) {
    max = max || 20;
    function filterNearest(entity) {
        return Math.abs(entity.x - x) < max && Math.abs(entity.z - z) < max;
    }

    function sortNearest(entityA, entityB) {
        let dA = Math.abs(entityA.x - x) + Math.abs(entityA.z - z);
        let dB = Math.abs(entityB.x - x) + Math.abs(entityB.z - z);
        return dA - dB;
    }

    const nearest = this.instances.filter(filterNearest);
    nearest.sort(sortNearest);
    return nearest.splice(0, 3);
};

Entity.entity = true;
Entity.instances = [];

module.exports = Entity;