const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');
const pathfinding = require('../../../services/pathfinding');
const Screen = require('../Screen');

const EditorPanel = require('../../UI/EditorPanel');
const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const HelpPanel = require('../../UI/HelpPanel');
const VictoryPanel = require('../../UI/VictoryPanel');
const Warning = require('../../UI/Warning');
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
let helpPanel;
let entityManagerPanel;
let editorPanel;
let ground;
let positioner;
let roadPositioner;
let road;

class ScreenCity extends Screen {

    initComponents(model, mapProperties) {

        camera = new Camera({
            map: mapProperties,
            zoom: model.camera.zoom || 1.3,
            zoomMax: 1.8,
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
        editorPanel = new EditorPanel();
        pathfinding.init(ground, ENTITIES);

        buildingMenu.onClickBuilding(entityId => {
            positioner.unselectEntity();
            roadPositioner.unselectEntity();
            positioner.selectEntity(entityId);
            positioner.moveEntity(camera.targetX, camera.targetZ, ground);
            const isRoad = roadPositioner.selectEntity(entityId);
            if(!isRoad)
                editorPanel.showEntityEditor();
            else
                editorPanel.showRoadeEditor();

            buildingMenu.close();
        });

        entityManagerPanel.onRemove(id => {
            this.get(id).restoreState();
            this.removeEntity(id);
            monitoringPanel.update();
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
        this.add(warning);
        this.add(helpPanel);
        this.add(entityManagerPanel);
        this.add(editorPanel);
        this.add(ground);
        this.add(positioner);
        this.add(roadPositioner);
        this.add(road);

        this.syncStateToEntity(model, mapProperties);

        editorPanel.onConfirm(() => {
            this.buildEntity();
            this.buildRoad();
            buildingMenu.open();
            positioner.unselectEntity();
            roadPositioner.unselectEntity();
        });

        editorPanel.onCancel(() => {
            positioner.unselectEntity();
            roadPositioner.unselectEntity();
            buildingMenu.open();
        });

        editorPanel.onRotate(() => {
            positioner.rotate();
        });
    }

    dismount() {

    }

    touchMove(x, z) {
        if(roadPositioner.selected) return;
        camera.dragg(x, z);
        light.moveTarget(camera.targetX, camera.targetY, camera.targetZ);
    }

    touchMoveOnMap(x, z) {
        roadPositioner.rolloutSelectedEntity(x, z, ground);
    }

    touchDragg(x, z, screenX, screenY) {
        positioner.moveEntity(x, z, ground);
    }

    selectedProjection(screenX, screenY) {
        console.log('selectedProjection', screenX, screenY);
        editorPanel.move(screenX, screenY);
    }

    touchStart(x, z) {

    }

    touchStartOnMap(x, z, id) {
        if(id && !positioner.selected) {
            entityManagerPanel.open(this.get(id));
        } else if(roadPositioner.selected) {
            roadPositioner.mouseDown(x, z)
        } else {
            buildingMenu.open();
        }
    }


    touchEnd(x, z) {
        camera.clearMove();
    }

    zoom(delta) {
        camera.scale(delta);
        light.scale(camera.zoom);
    }

    showHelper(IdEntity) {
        helpPanel.open(IdEntity);
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
        monitoringPanel.update();
    }

    syncCodeEntity() {
        codeToEntities = new Map();
        for(let id in ENTITIES) {
            if(ENTITIES[id].code) {
                codeToEntities.set(ENTITIES[id].code, id);
                codeToEntities.set(ENTITIES[id].code - 1, id);
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
            if(!codeToEntities.get(value)) continue;
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
        model.road = road.getSavedModel();
        this.syncEntityToState(model);
    }

    syncEntityToState(model) {
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
                entitySaved[props] = entity[props];
            }
            model.entities[type].push(entitySaved);
        }
    }

}

module.exports = ScreenCity;
