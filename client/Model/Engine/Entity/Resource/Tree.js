const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Tree extends Entity {

    constructor(params) {
        super(params);
        this.wood = params.wood || 10000;
        this.exp = params.exp || false;
        Tree.instances.push(this);
    }

    getResource(value) {
        this.updated = true;
        const quantity = Math.min(value, this.wood);
        this.wood -= value;
        this.exp = true;
        if(this.wood < 1) {
            ee.emit('removeEntity', this._id);
            ee.emit('newEntity', {x: this.x, y: this.y, z: this.z, type: 'TreeWeary'});
        }
        return quantity;
    }

    getWorkerSlot() {
        const a = Math.random() * Math.PI * 2;
        const x = this.x + Math.cos(a) * 0.35;
        const z = this.z + Math.sin(a) * 0.35;
        return {x: x, y: this.y, z: z, a: a}
    }

    onRemove() {
        const index = Tree.instances.indexOf(this);
        Tree.instances.splice(index, 1);
    }

}
Tree.selectable = false;
Tree.tile_x = 1;
Tree.tile_z = 1;
Tree.walkable = 0;
Tree.code = 255; //value in alpha blue
Tree.resource = true;
Tree.instances = [];
module.exports = Tree;
