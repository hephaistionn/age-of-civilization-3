const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');
const pathfinding = require('../../../../services/pathfinding');

class EntityPeon extends Entity {

    constructor(params) {
        super(params);
        this.power = params.power || 0;
        this._speed = 0.001;
        this.path = params.path ? params.path : pathfinding.computePath(params);
        this.timer = params.timer || 0;
        this._cycle = this.path ? pathfinding.getPathLength(this.path) / this._speed : 0;
    }

    update() {
        ee.emit('removeEntity', this._id);
        if(this.path) {
            //ee.emit transmettre les donn�e au target
        } else {
            //emit => rendre les donnee � la source
        }
    }
}

EntityPeon.selectable = true;
EntityPeon.description = 'I will go to an home to transmit my knowledge';
EntityPeon.tile_x = 1;
EntityPeon.tile_z = 1;
EntityPeon.walkable = 1;
module.exports = EntityPeon;
