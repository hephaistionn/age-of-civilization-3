const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');
const Screen = require('../Screen');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');
const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');
const LeaderCreationPanel = require('../../UI/LeaderCreationPanel');
const ENTITIES = require('../../Engine/Entity/listEntity');

let camera;
let light;
let worldmapMenu;
let entityManagerPanel;
let worldmap;
let firstStartPanel;
let leaderCreationPanel;
let cities = [];

class ScreenWorldmap extends Screen {

    initComponents(model, mapProperties) {
        camera = new Camera({map: mapProperties, zoom: model.camera.zoom || 0.8, zoomMax: 1.8,
            x: model.camera.x || mapProperties.nbTileX / 2 + 10, y: 24, z: model.camera.z || mapProperties.nbTileZ / 2 + 10
        });

        light = new Light({shadow: true, targetX: camera.targetX, targetY: camera.targetY, targetZ: camera.targetZ});

        worldmapMenu = new WorldmapMenu();
        entityManagerPanel = new EntityManagerPanel();

        worldmap = new Worldmap(mapProperties);

        this.add(camera);
        this.add(light);
        this.add(worldmapMenu);
        this.add(entityManagerPanel);
        this.add(worldmap);

        const currentLeader = stateManager.getCurrentLeader();
        if(!currentLeader.name) {
            firstStartPanel = new FirstStartPanel();
            this.add(firstStartPanel);
            firstStartPanel.onClose(()=> {
                leaderCreationPanel = new LeaderCreationPanel();
                this.add(leaderCreationPanel);
                this.remove(firstStartPanel);
                leaderCreationPanel.onClose(params => {
                    stateManager.updateLeaderName(params.name);
                    this.remove(leaderCreationPanel);
                    this.updateCities(model); //call when player level is updated
                });
            });
        }
    }

    beforeShow(model) {
        const currentLeader = stateManager.getCurrentLeader();
        if(currentLeader.name) {
            this.updateCities(model)
        }
    }

    updateCities(model) {
        for(let i = 0; i < model.cities.length; i++) {
            const params = stateManager.getCity(model.cities[i]);
            if(!cities.find(city => city.name === params.name)) {
                this.loadCity(params);
            }
        }

        const leaderId = stateManager.getCurrentLeader().id;
        const level = stateManager.currentLeader.level;
        const spawns = worldmap.citySpawns;
        const nextCities = stateManager.getCityNewCitiesByLevel(level);
        let currentIndex = model.cities.length;
        for(let j = 0; j < nextCities.length; j++) {
            const newCity = nextCities[j];
            if(!cities.find(city => city.name === newCity.name)) {
                this.newCity(spawns[currentIndex * 2], spawns[currentIndex * 2 + 1], 0, newCity.name, leaderId, newCity.goal);
                currentIndex++;
            }
        }

    }

    newCity(x, z, level, name, leaderId, goal) {
        const params = stateManager.newCity({
            level: level, x: x, z: z, name: name,
            y: worldmap.getHeightTile(x, z),
            leader: leaderId, goal: goal
        });
        const city = this.newEntity(params);
        cities.push(city);
        worldmap.updateAreaMap(cities);
    }

    loadCity(params) {
        const city = this.newEntity(params);
        cities.push(city);
        worldmap.updateAreaMap(cities)
    }

    newEntity(params) {
        const entity = new ENTITIES.City(params);
        this.add(entity);
        return entity;
    }

    update(dt) {
        worldmap.update(dt);
    }

    mouseMovePress(x, z) {
        camera.dragg(x, z);
        light.moveTarget(camera.targetX, camera.targetY, camera.targetZ);
    }

    mouseUp() {
        camera.cleatMove();
    }

    mouseMoveOnMap(x, z) {

    }

    mouseDownRight() {

    }

    mouseClick(x, z, id) {
        if(id) {
            entityManagerPanel.open(this.get(id));
        }
    }

    mouseWheel(delta) {
        camera.mouseWheel(delta);
        light.scale(camera.zoom);
    }

    dismount() {

    }

    syncState(model) {
        model.camera.x = camera.x;
        model.camera.z = camera.z;
        model.camera.zoom = camera.zoom;
    }

}

module.exports = ScreenWorldmap;
