const stateManager = require('../../../services/stateManager');
const ee = require('../../../services/eventEmitter');
const Entity = require('./Entity');

class EntityBasic {

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

    deductRessource(ressouceId, value) {
        if(this.states[ressouceId] === undefined) {
            this.states[ressouceId] -= Math.min(value, this.states[ressouceId]);
            ee.emit('updateCityStates');
        }
    }

    dismount(){
        const index = this.constructor.instances.indexOf(this);
        this.constructor.instances.splice(index, 1);
    }

}

EntityBasic.available = function available() {
    const enabled = this.enabled;
    const states = stateManager.currentCity.states;
    for(var stateId in enabled) {
        if(enabled[stateId] > states[stateId]) {
            return false;
        }
    }
    return true;
}; 
 
EntityBasic.checkState= function checkState() {
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

EntityBasic.getNearestEntities = Entity.getNearestEntities


EntityBasic.entity = true;
EntityBasic.instances = [];

module.exports = EntityBasic; 