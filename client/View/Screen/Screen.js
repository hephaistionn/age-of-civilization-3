const THREE = require('../../services/threejs');
const isMobile = require('../../services/mobileDetection')();

const COMPONENTS = {
    Map: require('./../Engine/Map'),
    Light: require('./../Engine/Light'),
    Camera: require('./../Engine/Camera'),
    Render: require('./../Engine/Render'),
    Positioner: require('./../Engine/Positioner'),
    RoadPositioner: require('./../Engine/RoadPositioner'),
    BuildingMenu: require('../UI/BuildingMenu')
};

class Screen {

    constructor() {
        this.canvas = document.getElementById('D3');
        this.dom = document.getElementById('UI');
        this.container = document.getElementById('container');
        this.render = new COMPONENTS.Render(this.canvas);
        this.mousePress = false;
        this.mouse = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.pressX = 0;
        this.pressZ = 0;
        this.initObservers();
    }

    mount(model) {
        for(let id in model) {
            this.newComponent(id, model[id]);
        }
    }

    dismount(model) {
        for(let id in model) {
            this.removeComponent(id)
        }
    }

    newComponent(id, model) {
        this[id] = new COMPONENTS[model.constructor.name](model);

        if(model.type === 'UI') {
            this.dom.appendChild(this[id].node);
        } else {
            this.render.addChild(this[id]);
        }
    }

    removeComponent(id) {
        if(this[id].type === 'UI') {
            this.dom.removeChild(this[id].node)
        } else {
            this[id].remove();
            this.render.removeChild(this[id])
        }
        delete this[id];
    }

    updateComponent(id, model) {
        if(this[id]) {
            if(model) {
                this[id].updateState(model);
            } else {
                this.removeComponent(id);
            }
        } else {
            this.newComponent(id, model);
        }
    }

    update(dt, model) {
        for(let id in model) {
            this[id].update(dt);
        }
        this.render.update();
    }

    getPointOnMap(screenX, screenY) {
        if(!this.map || !this.camera)return {x: 0, z: 0};
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        const intersects = this.raycaster.intersectObjects(this.map.chunksList, true);
        if(intersects.length) {
            const point = intersects[0].point;
            const tileSize = this.map.tileSize;
            point.x /= tileSize;
            point.z /= tileSize;
            const mesh = intersects[0].object;
            if(mesh.userData.model) {
                return {
                    model: mesh.userData.model,
                    x: point.x,
                    z: point.z
                }
            } else {
                return point;
            }

        } else {
            return {x: 0, z: 0};
        }
    }

    getPointOnMapCameraRelative(screenX, screenY) {
        if(!this.map || !this.camera)return {x: 0, z: 0};
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        const camera = this.camera.element;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        const intersects = this.raycaster.intersectObjects(this.map.chunksList, true);
        if(intersects.length) {
            const point = intersects[0].point;
            const tileSize = this.map.tileSize;
            point.x /= tileSize;
            point.z /= tileSize;
            point.x -= camera.matrixWorld.elements[12]/ this.camera.tileSize;
            point.z -= camera.matrixWorld.elements[14]/ this.camera.tileSize;
            return point;
        } else {
            return {x: 0, z: 0};
        }
    }

    touchSelected(screenX, screenY) {
        if(!this.map || !this.camera || !this.positioner.element)return false;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera.element);
        const intersects = this.raycaster.intersectObjects([this.positioner.element], true);
        if(intersects.length) {
            return true;
        } else {
            return false
        }
    }
}

if(isMobile) {
    require('./eventsMobile.js')(Screen);
} else {
    require('./eventsPC.js')(Screen);
}

module.exports = Screen;

