const THREE = require('../../services/threejs');
const config = require('./config');

module.exports = class Camera {

    constructor(model, parent) {
        const canvas = document.getElementById('D3');

        //this.element = new THREE.PerspectiveCamera(12, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.element = new THREE.OrthographicCamera(canvas.clientWidth / -15, canvas.clientWidth / 15, canvas.clientHeight / 15, canvas.clientHeight / -15, 1, 1000);
        this.element.userData.id = model.id;
        this.target = new THREE.Vector3();
        this.tileSize = config.tileSize;
        this.updateState(model);
        this.element.lookAt(this.target);
        this.add(parent);
    }

    updateState(model) {
        this.element.position.x = model.x * this.tileSize;
        this.element.position.y = model.y * this.tileSize;
        this.element.position.z = model.z * this.tileSize;
        this.target.x = model.targetX * this.tileSize;  //is used by three camera
        this.target.y = model.targetY * this.tileSize;
        this.target.z = model.targetZ * this.tileSize;
        this.element.zoom = model.zoom;
        this.element.updateProjectionMatrix();
    }

    resize(width, height) {
        this.element.aspect = width / height;
        this.element.updateProjectionMatrix();
    }

    remove(parent) {
        parent.render.camera = null;
    }

    add(parent) {
        parent.render.camera = this.element;
        parent.render.scene.camera = this.element;
    }
};
