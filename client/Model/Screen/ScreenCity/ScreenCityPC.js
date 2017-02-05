const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');
const pathfinding = require('../../../services/pathfinding');
const Screen = require('../Screen');

const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const VictoryPanel = require('../../UI/VictoryPanel');
const Ground = require('../../Engine/Ground');
const Light = require('../../Engine/Light');
const Camera = require('../../Engine/Camera');
const Positioner = require('../../Engine/Positioner');
const Road = require('../../Engine/Entity/Road/EntityRoad');
const ENTITIES = require('../../Engine/Entity/listEntity');


let removeMode = false;
let rotation = 0;
let codeToEntities;


let camera;
let light;
let buildingMenu;
let monitoringPanel;
let entityManagerPanel;
let ground;
let positioner;
let road;


class ScreenCity extends Screen {

    initComponents(model, mapProperties) {

        camera = new Camera({map: mapProperties, zoom: model.camera.zoom || 1.3, zoomMax: 1.8,
            x: model.camera.x || mapProperties.nbTileX / 2 + 20, y: 24, z: model.camera.z || mapProperties.nbTileZ / 2 + 20
        });
        light = new Light({shadow: true, targetX: camera.targetX, targetY: camera.targetY, targetZ: camera.targetZ});
        buildingMenu = new BuildingMenu();
        monitoringPanel = new MonitoringPanel();
        entityManagerPanel = new EntityManagerPanel();
        ground = new Ground(mapProperties);
        positioner = new Positioner(mapProperties);
        pathfinding.init(ground, ENTITIES);

        buildingMenu.onClickBuilding(entityId => {
            positioner.unselectEntity();
            removeMode = false;
            rotation = 0;
            if(entityId === 'Destroy') {
                removeMode = true;
            } else {
                positioner.selectEntity(entityId);
            }
        });

        stateManager.cityOnLevelUpdated(level => {
            console.log('level updated ', level);
        });

        stateManager.cityOnCompleted(() => {
            this.add(new VictoryPanel());
        });

        this.add(camera);
        this.add(light);
        this.add(buildingMenu);
        this.add(monitoringPanel);
        this.add(entityManagerPanel);
        this.add(ground);
        this.add(positioner);

        this.syncStateToEntity(model, mapProperties)
    }

    mouseMoveOnMap(x, z) {
        if(positioner.selected) {
            positioner.moveEntity(x, z, rotation, ground);
        }
    }

    mouseRotate() {
        rotation += Math.PI / 2;
        if(rotation >= Math.PI * 2) rotation = 0;
        positioner.moveEntity(positioner.x, positioner.z, rotation, ground);
    }

    mouseMoveOnMapPress(x, z) {

    }

    mouseMovePress(x, z) {
        camera.dragg(x, z);
        light.moveTarget(camera.targetX, camera.targetY, camera.targetZ);
    }

    mouseDown(x, z) {
    }

    mouseDownRight() {
        if(positioner.selected) {
            positioner.unselectEntity();
        }
        buildingMenu.collapse();
        removeMode = false;
    }

    mouseDownOnMap(x, z) {

    }

    mouseClick(x, z, id) {
        const params = positioner.getSelectEntity();
        if(removeMode) {
            if(id) {
                this.get(id).restoreState();
                this.removeEntity(id);
            }
        } else if(params) {
            const entity = this.newEntity(params);
            entity.updateState();
            positioner.unselectEntity();
            monitoringPanel.update();
        } else if(id) {
            entityManagerPanel.open(this.get(id));
        }
    }

    mouseUp() {
        camera.cleatMove();
    }


    mouseWheel(delta) {
        camera.mouseWheel(delta);
        light.scaleOffset(camera.offsetY);
        light.moveTarget(camera.targetX, camera.targetY, camera.targetZ);
    }

    newEntity(params) {
        const entity = new ENTITIES[params.type](params);
        this.add(entity);
        ground.setWalkableTile(entity);
        return entity;
    }

    removeEntity(entityId) {
        const entity = this.get(entityId);
        ground.setWalkableTile(entity, 1);
        this.remove(entity);
    }


    syncCodeEntity() {
        codeToEntities = new Map();
        for(let id in ENTITIES) {
            if(ENTITIES[id].code) {
                codeToEntities.set(ENTITIES[id].code, id);
            }
        }
    }

    syncEntityBuilding(modelCity) {
        for(let type in modelCity) {
            const list = modelCity[type];
            for(let i = 0; i < list.length; i++) {
                const params = list[i];
                params.type = type;
                this.newEntity(params);
            }
        }
    }

    syncEntityResource(resources) {
        let length = resources.length;
        const params = {x: 0, y: 0, z: 0, a: 0};
        for(let i = 0; i < length; i++) {
            let value = resources[i];
            if(value === 0) continue;
            params.type = codeToEntities.get(value);
            params.z = Math.floor(i / ground.nbTileX);
            params.x = i % ground.nbTileX;
            params.y = ground.getHeightTile(params.x, params.z);
            params.a = Math.floor(Math.random() * 3.99) * Math.PI;
            if(ground.grid.isWalkableAt(params.x, params.z)) {
                this.newEntity(params);
            }
        }
    }

    syncStateToEntity(model, modelMap) {
        this.syncCodeEntity();
        this.syncEntityBuilding(model.entities);
        this.syncEntityResource(modelMap.tilesResource);
    }

    syncState(model) {
        model.camera.x = camera.x;
        model.camera.z = camera.z;
        model.camera.zoom = camera.zoom;
        this.syncEntityToState(model);
    }

    syncEntityToState(model) {
        const hiddenProps = '_';
        model.entities = {};
        for(let id of this.components.keys()) {
            const entity = this.components.get(id);
            if(!entity.constructor.entity || entity.constructor.resource && !entity.exp) {
                continue;
            }
            const type = entity.constructor.name;
            if(!model.entities[type]) {
                model.entities[type] = [];
            }
            const entitySaved = {};
            for(let props in entity) {
                if(props[0] === hiddenProps)continue;
                if(entity[props] instanceof Uint16Array || entity[props] instanceof Uint8Array) {
                    entitySaved[props] = Array.from(entity[props])
                } else {
                    entitySaved[props] = entity[props];
                }
            }
            model.entities[type].push(entitySaved);
        }
    }
}

module.exports = ScreenCity;
