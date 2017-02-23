const stateManager = require('../../../services/stateManager');
const ee = require('../../../services/eventEmitter');
const pathfinding = require('../../../services/pathfinding');

class EntityCollector {

    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;
        this._id = parseInt(params._id, 10);
        this.state = params.state || 0;
        this.sourceId = params.sourceId;
        this.path = params.path ? params.path : null;
        this.resource = params.resource || 0;
        this.targetId = params.targetId ? params.targetId : null;
        this.cycle = params.cycle ? params.cycle : 1;
        this.timer = params.timer || 0;
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
        if(this.state === 0) {
            this.goTarget();
        } else if(this.state === 1) {
            this.startCut();
        } else if(this.state === 2) {
            this.comeback();
        } else if(this.state === 3) {
            this.store();
        } else {
            ee.emit('removeEntity', this._id);
        }
    }

    goTarget() {
        this.state = 1;
        ee.emit('getEntity', this.sourceId, sourceEntity => {
            if(sourceEntity) {
                const dataPath = pathfinding.computePath(sourceEntity, this._targetType);
                this.path = dataPath.path || null;
                this.targetId = dataPath.targetId || null;
                this.sourceId = dataPath.sourceId || null;
                this.cycle = dataPath.path ? pathfinding.getPathLength(this.path) / this._speed : 0;
                this.updated = true;
                if(this.path)
                    ee.emit('getEntity', this.targetId, entity => {
                        entity.exp = true;
                    })
            } else {
                ee.emit('removeEntity', this._id);
            }
        });
    }

    startCut() {
        this.state = 2;
        ee.emit('getEntity', this.targetId, entity => {
            if(entity) {
                this.cycle = this._workDuration;
                const workerSlot = entity.getWorkerSlot();
                this.moveFree(workerSlot.x, workerSlot.y, workerSlot.z, workerSlot.a);
                this.updated = true;
            } else {
                ee.emit('removeEntity', this._id);
            }
        });
    }

    comeback() {
        this.state = 3;
        ee.emit('getEntity', this.targetId, entity => {
            if(entity && entity.wood > 0) {
                this.resource = entity.getResource(this._capacity);
                this.path = pathfinding.revert(this.path);
                this.cycle = pathfinding.getPathLength(this.path) / this._speed;
                this.updated = true;
            } else {
                ee.emit('removeEntity', this._id);
            }
        });
    }

    store() {
        this.state = 4;
        ee.emit('getEntity', this.sourceId, entity => {
            if(entity) {
                entity.store(this.resource);
                this.resource = 0;
            }
            ee.emit('removeEntity', this._id);
        });

    }

    getTiles() {
        return [this.x - 0.5, this.x - 0.5];
    }

}

EntityCollector.getNearestEntities = function getNearestEntities(x, z, max) {
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

EntityCollector.entity = true;

module.exports = EntityCollector;