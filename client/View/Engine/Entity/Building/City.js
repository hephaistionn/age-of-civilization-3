const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const THREE = require('three');
const material = require('../../Material/materialA');

module.exports = class City {

    constructor(model, parent) {
        this.model = model;
        this.updateMesh();
        this.level = this.model.level;
        this.updateState();
        this.add(parent);
    }

    updateMesh() {
        let path; // path = path.replace('@1', model.geo).replace('@2', model.level);
        if(this.model.level === 0) {
            path = 'obj/flagA.obj';
        } else {
            path = 'obj/cityA.obj';
        }

        if(this.element) {
            const mesh = THREE.getMesh(path, material, model.id);
            this.element.parent.remove(this.element);
            this.element.parent.add(mesh);
            this.element = mesh;
        } else {
            this.element = THREE.getMesh(path, material);
        }
    }

    updateState() {
        if(this.model.level !== this.level) {
            this.level = this.model.level;
            this.updateMesh();
        }
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = this.model.x * tileSize;
        matrixWorld[14] = this.model.z * tileSize;
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
};
