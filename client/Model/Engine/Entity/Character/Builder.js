const stateManager = require('../../..//../services/stateManager');
const ee = require('../../../../services/eventEmitter');
const pathfinding = require('../../../../services/pathfinding');


const WAIT = 0;
const GOTOREPO = 1;
const BACKTOENTITY = 2;
const BUILD = 3;

class Builder {
    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;
        this._id = parseInt(params._id, 10);

        this.step = params.step || WAIT;// 0 wand material, 1 return material;

        this.sourceId = params.sourceId;
        this.path = params.path ? params.path : null;

        this.ressourceId = '';
        this.ressourceValue = 0;
        this.ressourceRequired = 0;
        this.targetId = params.targetId ? params.targetId : null;
        this.targetType = params.targetType;

        this.cycle = params.cycle ? params.cycle : 1;
        this.timer = params.timer || 0;
        this._capacity = 10;
        this._workDuration = 5000;
        this._speed = 0.001;
    }


    getNeededMaterials()  {
        ee.emit('getEntity', this.sourceId, sourceEntity => {
            if(sourceEntity){
                const need = sourceEntity.buildingNeed();
                this.x = sourceEntity.x;
                this.y = sourceEntity.y;
                this.z = sourceEntity.z;
                if(!need) {
                    this.cycle = sourceEntity.constructor.constuctDuration;
                    this.step = BUILD;
                    this.updated = true;   
                }else{
                    this.ressourceId = need[0];
                    this.ressourceRequired = need[1];
                    this.ressourceValue = 0;
                    this.findNeededMaterials(sourceEntity);  
                }
            } else {
                ee.emit('removeEntity', this._id);
            }
        });
    }

    findNeededMaterials(sourceEntity) {  
        const dataPath = pathfinding.computePath(sourceEntity, this.targetType, this.constructor.authorizedTile, this.ressourceId, this.ressourceRequired);
        this.path = dataPath.path || null; 
        this.targetId = dataPath.targetId || null;
        this.cycle = dataPath.path ? pathfinding.getPathLength(this.path) / this._speed : 0;
        this.updated = true;
        if(!this.path){
            this.step = WAIT;
            this.cycle = 5000;
            //restart Process after 5sec
        }else{
            this.step = GOTOREPO;
        }
    }

    takeNeededMaterials() { 
        this.updated = true;
        ee.emit('getEntity', this.targetId, entity => {
            if(entity) {
                this.ressourceValue =  entity.deductRessource(this.ressourceId, this.ressourceRequired);
                if(this.ressourceValue > 0){
                   this.comeback();
                } else {
                   this.step = WAIT;
                   this.cycle = 5000;
                   //restart Process after 5sec
                }
            } else {
               this.step = WAIT;
               this.cycle = 5000;
            }
        });
    }

    comeback() {
        this.path = pathfinding.revert(this.path);
        this.cycle = pathfinding.getPathLength(this.path) / this._speed;
        this.step = BACKTOENTITY; 
        this.updated = true;
    }

    dropNeededMaterials() {
        ee.emit('getEntity', this.sourceId, entity => {
            if(entity) {
                entity.buildingProgress(this.ressourceId, this.ressourceValue);
            }
        });
        this.cycle =  1;
        this.step = WAIT;
        this.updated = true; 
    }

    finishConstruct() {
         ee.emit('getEntity', this.sourceId, entity => {
            if(entity) {
                entity.buildingFinish();
            }
            ee.emit('removeEntity', this._id);
        });
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
        }else if (this.step === BACKTOENTITY){
            this.dropNeededMaterials();
        }else if(this.step === BUILD){
            this.finishConstruct();
        }else{
            this.getNeededMaterials();
        }
        
    }

    getTiles() {
        return [this.x - 0.5, this.x - 0.5];
    }

    dismount() {

    }

}

Builder.entity = true;
Builder.authorizedTile = 1;

module.exports = Builder;