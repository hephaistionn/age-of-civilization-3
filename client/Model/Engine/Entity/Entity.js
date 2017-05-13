const stateManager = require('../../../services/stateManager');
const ee = require('../../../services/eventEmitter');

class Entity {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this._id = parseInt(params._id, 10);
        this.move(params.x || 0, params.y || 0, params.z || 0, params.a || 0);

        //Trigger for stateManager for get all entities states

        this.builded = params.builded !== undefined ? params.builded : true;
        this.materials = {};
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

    getData() {
        const displayed = this.constructor.displayed;
        const data = {};
        for(let i=0; i<displayed.length; i++) {
            const key = displayed[i];
            if(this.states[key] !== undefined) {
                data[key] = this.states[key];
            }
        }
        return data;
    }

    storeRessource(ressouceId, value) {
        if(this.states[ressouceId] !== undefined) {
            this.states[ressouceId] += value;
            this.states[ressouceId] = Math.min(this.states[ressouceId], this.statesMax[ressouceId] );
            ee.emit('updateCityStates');
        }
        this.workers--;
    }

    deductRessource(ressouceId, value) {
        if(this.states[ressouceId] !== undefined) {
            const recovered = Math.min(value, this.states[ressouceId]);
            this.states[ressouceId] -= recovered;
            ee.emit('updateCityStates');
            return recovered;
        }
    }

    buildingStart() {
        this.builded = false;
        ee.emit('updateCityStates');
        ee.emit('newEntity', {sourceId: this._id, type: 'Builder', targetType: 'Repository'});
    }

    buildingProgress(eleId, value) {
        this.materials[eleId]===undefined ? this.materials[eleId] = value : this.materials[eleId] += value; 
    }

    buildingFinish() {
        this.updated = true;
        this.builded = true;
        this.materials = {};
    }

    buildingNeed() {
        const cost = this.constructor.cost;
        for(let eleId in cost){
            const current = this.materials[eleId]||0;
            if(current<cost[eleId]) {
                return [eleId, cost[eleId] - current];
            }
        }
        return null;
    }

    dismount(){
        const index = this.constructor.instances.indexOf(this);
        this.constructor.instances.splice(index, 1);
    }

}

Entity.checkState= function checkState() {
    let eleId;
    const cost = this.cost;
    const require = this.require;
    const states = stateManager.currentCity.states;
    const required =  new Map();
    for(eleId in cost) {
        if(states[eleId] < cost[eleId]){
            required.set(eleId,  cost[eleId]);
        }
    }
    for(eleId in require) {
        if(states[eleId] < require[eleId]){
            required.set(eleId,  require[eleId]);
        }
    }
    return required;
};

Entity.available = function available() {
    const enabled = this.enabled;
    const states = stateManager.currentCity.states;
    for(var stateId in enabled) {
        if(enabled[stateId] > states[stateId]) {
            return false;
        }
    }
    return true;
}; 

Entity.getNearestEntities = function getNearestEntities(x, z, max, eleId, value) {
    max = max || 20;
    function filterNearest(entity) {
        return Math.abs(entity.x - x) < max && Math.abs(entity.z - z) < max;
    }

    function filterNearestWithWantedElement(entity){
       return Math.abs(entity.x - x) < max && Math.abs(entity.z - z) < max && entity.states[eleId] >= value; 
    }

    function sortNearest(entityA, entityB) {
        let dA = Math.abs(entityA.x - x) + Math.abs(entityA.z - z);
        let dB = Math.abs(entityB.x - x) + Math.abs(entityB.z - z);
        return dA - dB;
    }

    const nearest = !eleId ? this.instances.filter(filterNearest) : this.instances.filter(filterNearestWithWantedElement) ;

    nearest.sort(sortNearest);
    return nearest.splice(0, 3);
};

Entity.entity = true;
Entity.instances = [];

module.exports = Entity;