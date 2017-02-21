const stateManager = require('../../../services/stateManager');
const ee = require('../../../services/eventEmitter');
const pathfinding = require('../../../services/pathfinding');

class EntityCarrier {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this._id = parseInt(params._id, 10);
        this.state = params.state || 0;
        this.path = params.path ? params.path : null;
        this.sourceId = params.sourceId;
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
            this.put();
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
            } else {
                ee.emit('removeEntity', this._id);
            }
        });
    }

    put() {
        this.state = 2;
        ee.emit('getEntity', this.targetId, entity => {
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

EntityCarrier.getNearestEntities = function getNearestEntities(x, z, max) {
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

EntityCarrier.entity = true;

module.exports = EntityCarrier;