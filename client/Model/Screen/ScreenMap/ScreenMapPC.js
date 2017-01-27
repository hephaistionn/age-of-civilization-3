const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const BuildingMenu = require('../../UI/BuildingMenu');
const MonitoringPanel = require('../../UI/MonitoringPanel');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const VictoryPanel = require('../../UI/VictoryPanel');

const Map = require('../../Engine/Map');
const Light = require('../../Engine/Light');
const Camera = require('../../Engine/Camera');
const Positioner = require('../../Engine/Positioner');
const RoadPositioner = require('../../Engine/RoadPositioner');
const Road = require('../../Engine/Entity/Road/EntityRoad');
const Entity = require('../../Engine/Entity/Entity');

let removeMode = false;
let rotation = 0;
let cycle = 0;

class ScreenMap {

    constructor(model, mapProperties) {

        this.camera = new Camera({
            map: mapProperties,
            zoom: model.zoom || 1.3,
            zoomMax: 1.8
        });

        this.camera.move(
            model.camera.x || mapProperties.nbTileX / 2 + 10,
            model.camera.z || mapProperties.nbTileZ / 2 + 10
        );

        this.light = new Light({shadow: true});
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
        this.light.scaleOffset(-this.camera.offsetY);

        this.buildingMenu = new BuildingMenu();
        this.monitoringPanel = new MonitoringPanel();
        this.entityManagerPanel = new EntityManagerPanel();

        this.map = new Map(mapProperties, model.map);

        this.positioner = new Positioner(mapProperties);

        this.roadPositioner = new RoadPositioner(mapProperties);

        this.buildingMenu.onClickBuilding(entityId => {
            this.positioner.unselectEnity();
            this.roadPositioner.unselectEnity();
            removeMode = false;
            rotation = 0;

            if(entityId === 'Destroy') {
                removeMode = true;
            } else if(entityId === 'Road') {
                this.roadPositioner.selectEnity(2);
            } else {
                this.positioner.selectEnity(entityId);
            }
        });

        this.entityManagerPanel.onBuild(entityId => {
            //this.positioner.unselectEnity();
            //removeMode = false;
            //rotation = 0;
            //this.positioner.selectEnity(entityId);
            //this.entityManagerPanel.close();
        });

        stateManager.cityOnLevelUpdated( level => {
            console.log('level updated ', level);
        });

    }

    update(dt) {
        this.map.update(dt);

        if(cycle > 1000) {
            cycle = 0;
            stateManager.cityUpdateLevel();
            if(stateManager.cityGoalAchieved() && !stateManager.cityIsItCompleted()) {
                stateManager.incraseLeaderLevel();
                stateManager.cityComplete();
                this.victoryPanel = new VictoryPanel();
                // l'objectif est indiqué sur la  worldmap,  quand la ville est  selectionné.
            }
        }
        cycle += dt
    }

    dismount() {

    }

    mouseMoveOnMap(x, z) {
        if(this.positioner.selected) {
            this.positioner.moveEntity(x, z, rotation, this.map);
        } else if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.moveEntity(x, z, this.map);
        }
    }

    mouseRotate() {
        rotation += Math.PI / 2;
        if(rotation >= Math.PI * 2) rotation = 0;
        var x = this.positioner.x;
        var z = this.positioner.z;
        this.positioner.moveEntity(x, z, rotation, this.map);
    }

    mouseMoveOnMapPress(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.rolloutSelectedEntity(x, z, this.map);
        }
    }

    mouseMovePress(x, z) {
        if(this.roadPositioner.selected) return;
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    mouseDown(x, z) {
        if(this.roadPositioner.selected)return;
        if(removeMode)return;
    }

    mouseDownRight() {
        if(this.roadPositioner.selected) {
            this.roadPositioner.unselectEnity();
        }
        if(this.positioner.selected) {
            this.positioner.unselectEnity();
        }

        this.buildingMenu.collapse();
        removeMode = false;
    }

    mouseDownOnMap(x, z) {
        if(this.roadPositioner && this.roadPositioner.selected) {
            this.roadPositioner.mouseDown(x, z);
        }
    }

    mouseClick(x, z, model) {
        if(removeMode) {
            if(model) {
                this.map.clearTile(x, z, model);
            } else {
                this.map.updateEntity('EntityRoad', null, {
                    tiles: [Math.floor(x), Math.floor(z)],
                    walkable: [1],
                    length: 1
                });
            }
        } else if(this.positioner.selected && !this.positioner.undroppable) {
            const entity = this.positioner.selected;
            const available = entity.constructor.available();
            if(!available) return; //not enough resources
            const params = {entityId: entity.constructor.name, x: entity.x, y: entity.y, z: entity.z, a: entity.a};
            this.map.newEntity(params);
            entity.constructor.construction();
            this.positioner.unselectEnity();
            this.buildingMenu.updateCurrentCategory();
            this.monitoringPanel.updated = true;
        } else if(this.roadPositioner.selected) {
            this.roadPositioner.moveEntity(x, z, this.map);
            const params = this.roadPositioner.getNewRoad();
            if(params) {
                const built = Road.construction(params);
                if(!built) return; //not enough resource
                if(this.map.entityGroups['EntityRoad'].length === 0) {
                    this.map.newEntity({entityId: 'EntityRoad'});
                }
            }
        } else if(model) {
            this.entityManagerPanel.open(model);
        }
    }

    mouseUp() {
        this.camera.cleatMove();
        if(!this.roadPositioner.selected) return;
        const params = this.roadPositioner.getNewRoad();
        if(params) {
            const built = Road.construction(params);
            if(!built) return; //not enough resources
            if(this.map.entityGroups['EntityRoad'].length === 0) {
                this.map.newEntity({entityId: 'EntityRoad'});
            }
            this.map.updateEntity('EntityRoad', null, params);
        }
    }


    mouseWheel(delta) {
        this.camera.mouseWheel(delta);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    newEntity(params) {
        params.map = this.map;
        params.map = this.map;
        this.map.newEntity(params);
    }

    removeEntity(entity) {
        this.map.removeEntity(entity);
    }

    syncState(model) {
        model.camera.x = this.camera.x;
        model.camera.z = this.camera.z;
        model.camera.zoom = this.camera.zoom;
        this.map.syncState(model.map);
    }

}

module.exports = ScreenMap;
