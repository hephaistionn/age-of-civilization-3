const THREE = require('../../services/threejs');
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('D3')});

module.exports = class Scene {

    constructor(canvas) {
        this.canvas = canvas;
        this.camera = null;
        this.renderer = renderer;
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.scene = new THREE.Scene();
        this.scene.matrixAutoUpdate = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.renderer.setSize(width, height);
    }

    dismount() {
        this.canvas.removeEventListener('resize', this._resize);
    }

    updateState(color) {
        this.renderer.setClearColor(color);
    }
};
