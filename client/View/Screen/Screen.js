const THREE = require('../../services/threejs');
const isMobile = require('../../services/mobileDetection')();

const COMPONENTS = require('../Engine/Entity/listEntity');
COMPONENTS.Ground = require('../Engine/Ground');
COMPONENTS.Light = require('../Engine/Light');
COMPONENTS.Camera = require('../Engine/Camera');
COMPONENTS.Render = require('../Engine/Render');
COMPONENTS.Positioner = require('../Engine/Positioner');
COMPONENTS.RoadPositioner = require('../Engine/RoadPositioner');
COMPONENTS.Worldmap = require('../Engine/Worldmap');
COMPONENTS.BuildingMenu = require('../UI/BuildingMenu');
COMPONENTS.EditorPanel = require('../UI/EditorPanel');
COMPONENTS.MonitoringPanel = require('../UI/MonitoringPanel');
COMPONENTS.WorldmapMenu = require('../UI/WorldmapMenu');
COMPONENTS.EntityManagerPanel = require('../UI/EntityManagerPanel');
COMPONENTS.FirstStartPanel = require('../UI/FirstStartPanel');
COMPONENTS.LeaderCreationPanel = require('../UI/LeaderCreationPanel');
COMPONENTS.VictoryPanel = require('../UI/VictoryPanel');

const CAMERA = 1;
const GROUND = 2;
const POSITIONER = 3;

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
        this.events = {};
        this.components = new Map();
    }

    mount(model) {
        this.update(0, model);
        this.initObservers();
    }

    dismount() {
        this.update(0);
        this.removeObservers();
    }

    hide(model) {
        const none = 'none';
        for(let i = 0; i < this.dom.childNodes.length; i++) {
            if(model.components.has(parseInt(this.dom.childNodes[i].id))) {
                this.dom.childNodes[i].style.display = none;
            }
        }
        this.removeObservers();
    }

    show(model) {
        const empty = '';
        for(let i = 0; i < this.dom.childNodes.length; i++) {
            if(model.components.has(parseInt(this.dom.childNodes[i].id))) {
                this.dom.childNodes[i].style.display = empty;
            }
        }
        this.initObservers();
        //this.components.get(GROUND).refreshTexture(model.get(GROUND));
    }

    update(dt, model) {
        if(!model) {
            const views = this.components;
            for(let id of views.keys()) {
                views.get(id).remove(this);
                views.delete(id);
            }
            return;
        }

        const models = model.components;
        const views = this.components;

        for(let id of models.keys()) {
            if(!views.has(id)) {
                views.set(id, new COMPONENTS[models.get(id).constructor.name](models.get(id), this));
            } else {
                if(models.get(id).updated) {
                    views.get(id).updateState(models.get(id));
                    models.get(id).updated = false;
                }
                if(views.get(id).update) {
                    views.get(id).update(dt);
                }
            }
        }

        for(let id of views.keys()) {
            if(!models.has(id)) {
                views.get(id).remove(this);
                views.delete(id);
            }
        }

        this.render.update();
    }

    getPointOnMap(screenX, screenY, recursive) {
        var components = this.components;
        if(!components.has(CAMERA)) return;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, components.get(CAMERA).element);
        let intersects;
        if(recursive) {
            intersects = this.raycaster.intersectObjects(this.render.scene.children, recursive);
        } else {
            intersects = this.raycaster.intersectObjects(components.get(GROUND).clickableArea, recursive);
        }
        const tileSize = components.get(GROUND).tileSize;
        if(intersects.length) {
            const point = intersects[0].point;
            point.x /= tileSize;
            point.z /= tileSize;
            const mesh = intersects[0].object;
            if(mesh.name) {////////////////
                return {
                    id: mesh.name,
                    x: point.x,
                    z: point.z
                }
            } else {
                return point;
            }

        } else {
            return;
        }
    }

    getPointOnMapCameraRelative(screenX, screenY, recursive) {
        var components = this.components;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        const camera = components.get(CAMERA);
        this.raycaster.setFromCamera(this.mouse, camera.element);
        const intersects = this.raycaster.intersectObjects(components.get(GROUND).clickableArea, recursive);
        const tileSize = components.get(GROUND).tileSize;
        if(intersects.length) {
            const point = intersects[0].point;
            point.x /= tileSize;
            point.z /= tileSize;
            point.x -= camera.element.matrixWorld.elements[12] / camera.tileSize;
            point.z -= camera.element.matrixWorld.elements[14] / camera.tileSize;
            return point;
        }
    }

    touchSelected(screenX, screenY) {
        if(!this.components.has(POSITIONER)) return false;
        this.mouse.x = ( screenX / this.canvas.width ) * 2 - 1;
        this.mouse.y = -( screenY / this.canvas.height ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.components.get(CAMERA).element);
        const intersects = this.raycaster.intersectObjects([this.components.get(POSITIONER).element], true);
        if(intersects.length) {
            return true;
        } else {
            return false
        }
    }

    _resize(e) {
        this.canvas.style = '';
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.components.get(CAMERA).resize(width, height);
        this.render.resize(width, height);
    }
}

if(isMobile) {
    require('./eventsMobile.js')(Screen);
} else {
    require('./eventsPC.js')(Screen);
}

module.exports = Screen;
