const stateManager = require('../../..//../services/stateManager');
const ee = require('../../../../services/eventEmitter');
const pathfinding = require('../../../../services/pathfinding');


const WAIT = 0;
const GOTOREPO = 1;
const BACK = 2;

class Trader {
    constructor(params) {
    	this._id = parseInt(params._id, 10);

        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;


        this.step = params.step || WAIT;

        this.path = params.path ? params.path : null;

        this.purchased = params.purchased;
        this.sold = params.sold;
        this.quantity = params.quantity;;
        this.targetId = params.targetId ? params.targetId : null;
        this.targetType = 'Repository';

        this.cycle = params.cycle ? params.cycle : 1;
        this._speed = 0.001;
        this.timer = params.timer || 0; 

        if(!this.path)
        	this.findNeededMaterials();
    }


    findNeededMaterials(sourceEntity) {  
    	console.log('-----findNeededMaterials-----')
        const dataPath = pathfinding.computePath(this, this.targetType, this.constructor.authorizedTile, this.purchased, this.quantity);
        this.path = dataPath.path || null; 
        this.targetId = dataPath.targetId || null;
        this.cycle = dataPath.path ? pathfinding.getPathLength(this.path) / this._speed : 0;
        this.updated = true;
        if(!this.path){
        	ee.emit('removeEntity', this._id);
        }else{
        	console.log('go to')
            this.step = GOTOREPO;
        }
    }

    takeNeededMaterials() { 
    	console.log('-----takeNeededMaterials-----')
        this.updated = true;
        ee.emit('getEntity', this.targetId, entity => {
        	console.log('target',entity)
            if(entity) {
                this.quantity =  entity.deductRessource(this.purchased, this.quantity);
                entity.storeRessource(this.sold, this.quantity); 
                if(this.quantity > 0){
                   this.comeback();
                } else {
					ee.emit('removeEntity', this._id);
                }
            } else {
            	ee.emit('removeEntity', this._id);
            }
        });
    }

    comeback() {
        this.path = pathfinding.revert(this.path);
        this.cycle = pathfinding.getPathLength(this.path) / this._speed;
        this.step = BACK; 
        this.updated = true;
    }

    move(x, y, z, a) {
        this.a = a !== undefined ? a : this.a;
        this.x = Math.round((x - 0.5));
        this.z = Math.round((z - 0.5));
        this.y = y;
    }

    moveFree(x, y, z, a) {
        this.a = a;
        this.x = x;
        this.z = z;
        this.y = y;
    }

    updateTimer(dt) {
        this.timer += dt;
        if(this.timer > this.cycle) {
            this.update();
            this.timer = 0;
        }
    }

    update() {
        if(this.step === GOTOREPO) {
            this.takeNeededMaterials();    
        }else if (this.step === BACK){
            ee.emit('removeEntity', this._id);
            this.step === WAIT;
        }
        
    }

    getTiles() {
        return [this.x - 0.5, this.x - 0.5];
    }

    dismount() {

    }

}

Trader.entity = true;
Trader.authorizedTile = 1;

module.exports = Trader;