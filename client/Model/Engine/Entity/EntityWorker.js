const stateManager = require('../../../services/stateManager');
const ee = require('../../../services/eventEmitter');
const pathfinding = require('../../../services/pathfinding');

class EntityWorker {

    constructor(params) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.a = 0;
        this._id = parseInt(params._id, 10);
        this.state = params.state || 0;
        this.sourceId = params.sourceId;
        this.cycle = 1;
        this.timer = params.timer || 0;
        this.constructor.instances.push(this);
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
            this.cycle = this._cycleDuration;
            this.update();
            this.timer = 0;
        }
    }

    update() {
        if(this.step < this._maxStep) {
            this.step++;
        } else {
            this.step = 0;
        }
        ee.emit('getEntity', this.sourceId, entity => {
            if(entity) {
                const workerSlot = entity.getWorkerSlot(this.step);
                this.moveFree(workerSlot.x, workerSlot.y, workerSlot.z, workerSlot.a);
                this.updated = true;
            } else {
                ee.emit('removeEntity', this._id);
            }
        });

    }

    getTiles() {
        return [this.x - 0.5, this.x - 0.5];
    }

    dismount() {
        const index = this.constructor.instances.indexOf(this);
        this.constructor.instances.splice(index, 1);
    }
}

EntityWorker.getNearestEntities = function getNearestEntities(x, z, max) {
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

EntityWorker.entity = false; //must not be saved

module.exports = EntityWorker;