const Shape = require('../../../services/shape');
const config = require('../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;

class Entity {

    constructor(model, parent, materialForce) {
        this.model = model;
        this.element = null;
        this.initMesh(model, materialForce);
        this.updateState();
        this.add(parent);
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }

    remove(parent) {
        parent.render.scene.remove(this.element);
    }

    add(parent) {
        if(parent)
            parent.render.scene.add(this.element);
    }
}


module.exports = Entity;