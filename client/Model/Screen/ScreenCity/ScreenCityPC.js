const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');
const pathfinding = require('../../../services/pathfinding');
const Screen = require('../Screen');

const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const HelpPanel = require('../../UI/HelpPanel');
const Warning = require('../../UI/Warning');
const VictoryPanel = require('../../UI/VictoryPanel');
const Ground = require('../../Engine/Ground');
const Light = require('../../Engine/Light');
const Camera = require('../../Engine/Camera');
const Positioner = require('../../Engine/Positioner');
const RoadPositioner = require('../../Engine/RoadPositioner');
const Road = require('../../Engine/Entity/Road/Road');
const ENTITIES = require('../../Engine/Entity/listEntity');

let codeToEntities;

let camera;
let light;
let buildingMenu;
let monitoringPanel;
let warning;
let entityManagerPanel;
let helpPanel;
let ground;
let positioner;
let roadPositioner;
let road;

class ScreenCity extends Screen {

    initComponents(model, mapProperties) {

        camera = new Camera({
            map: mapProperties,
            zoom: model.camera.zoom || 1.3,
            zoomMax: 3,
            x: model.camera.x || mapProperties.nbTileX / 2 + 20,
            y: 24,
            z: model.camera.z || mapProperties.nbTileZ / 2 + 20
        });
        light = new Light({shadow: true, targetX: camera.targetX, targetY: camera.targetY, targetZ: camera.targetZ});
        buildingMenu = new BuildingMenu();
        monitoringPanel = new MonitoringPanel();
        warning = new Warning();
        helpPanel = new HelpPanel();
        entityManagerPanel = new EntityManagerPanel();
        ground = new Ground(mapProperties);
        road = new Road(ground, model.road);
        positioner = new Positioner(mapProperties);
        roadPositioner = new RoadPositioner(mapProperties);
        pathfinding.init(ground, ENTITIES);

        buildingMenu.onClickBuilding(entityId => {
            positioner.unselectEntity();
            roadPositioner.unselectEntity();
            positioner.selectEntity(entityId);
            roadPositioner.selectEntity(entityId);
            buildingMenu.close();
        });

        stateManager.cityOnLevelUpdated(level => {
            console.log('level updated ', level);
        });

        stateManager.cityOnCompleted(() => {
            this.add(new VictoryPanel());
        });

        entityManagerPanel.onRemove(id => {
            this.get(id).restoreState();
            this.removeEntity(id);
            monitoringPanel.update();
        });

        this.add(camera);
        this.add(light);
        this.add(buildingMenu);
        this.add(monitoringPanel);
        this.add(warning);
        this.add(helpPanel);
        this.add(entityManagerPanel);
        this.add(ground);
        this.add(positioner);
        this.add(roadPositioner);
        this.add(road);

        this.syncStateToEntity(model, mapProperties);
    }

    mouseMoveOnMap(x, z) {
        positioner.moveEntity(x, z, ground);
        roadPositioner.moveEntity(x, z, ground);
    }

    mouseRotate() {
        positioner.rotate();
    }

    mouseMoveOnMapPress(x, z) {
        roadPositioner.rolloutSelectedEntity(x, z, ground);
    }

    mouseMovePress(x, z) {
        if(roadPositioner.selected) return;
        camera.dragg(x, z);
        light.moveTarget(camera.targetX, camera.targetY, camera.targetZ);
    }

    mouseDown(x, z) {
    }

    mouseDownRight() {
        positioner.unselectEntity();
        roadPositioner.unselectEntity();
        buildingMenu.collapse();
    }

    mouseDownOnMap(x, z) {
        roadPositioner.mouseDown(x, z);
    }

    showHelper(IdEntity) {
        helpPanel.open(IdEntity);
    }

    mouseClick(x, z, id) {
        if(id) {
            entityManagerPanel.open(this.get(id));
        } else {
            this.buildEntity();
            this.buildRoad();
        }
        buildingMenu.open();
    }

    mouseUp() {
        camera.clearMove();
        this.buildRoad();
        buildingMenu.open();
    }


    mouseWheel(delta) {
        camera.mouseWheel(delta);
        light.scale(camera.zoom);
    }

    newEntity(params) {
        const entity = new ENTITIES[params.type](params);
        this.add(entity);
        ground.setWalkableTile(entity);
        return entity;
    }

    removeEntity(entityId) {
        const entity = this.get(entityId);
        if(!entity) return;
        ground.setWalkableTile(entity, 1);
        this.remove(entity);
    }

    getEntity(entityId, callback) {
        const entity = this.get(entityId);
        callback(entity);
    }

    buildEntity() {
        const params = positioner.getSelectEntity();
        if(!params) return;
        const entity = this.newEntity(params);
        entity.pullState();
        positioner.unselectEntity();
        monitoringPanel.update();
    }

    buildRoad() {
        let params = roadPositioner.getSelectEntity();
        if(!params) return;
        road.updateState(params);
        road.pullState(params);
        roadPositioner.unselectEntity();
        monitoringPanel.update();
    }

    syncCodeEntity() {
        codeToEntities = new Map();
        for(let id in ENTITIES) {
            if(ENTITIES[id].code) {
                codeToEntities.set(ENTITIES[id].code, id);
                codeToEntities.set(ENTITIES[id].code - 1, id);
                codeToEntities.set(ENTITIES[id].code - 2, id);
                codeToEntities.set(ENTITIES[id].code - 3, id);
                codeToEntities.set(ENTITIES[id].code - 4, id);
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

            if(!params.type) continue;
            if(ground.grid.isWalkableAt(params.x, params.z) === 1) {
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
        model.road = road.getSavedModel();
        this.syncEntityToState(model);
    }

    syncEntityToState(model) {
        // const hiddenProps = '_';
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
                // if(props[0] === hiddenProps)continue;
                entitySaved[props] = entity[props];
            }
            model.entities[type].push(entitySaved);
        }
    }
}

module.exports = ScreenCity;
