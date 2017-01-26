const ee = require('../../../services/eventEmitter');
const stateManager = require('../../../services/stateManager');

const Camera = require('../../Engine/Camera');
const Light = require('../../Engine/Light');
const Worldmap = require('../../Engine/Worldmap');

const WorldmapMenu = require('../../UI/WorldmapMenu');
const EntityManagerPanel = require('../../UI/EntityManagerPanel');
const FirstStartPanel = require('../../UI/FirstStartPanel');
const LeaderCreationPanel = require('../../UI/LeaderCreationPanel');

class ScreenWorldmap {

    constructor(model, mapProperties) {

        this.camera = new Camera({map: mapProperties, zoom: model.zoom || 1});

        this.camera.move(
            model.camera.x || mapProperties.nbTileX / 2 + 10,
            model.camera.z || mapProperties.nbTileZ / 2 + 10
        );

        this.light = new Light({
            offsetX: -10,
            offsetY: -40,
            offsetZ: -10
        });
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);

        this.worldmapMenu = new WorldmapMenu();
        this.entityManagerPanel = new EntityManagerPanel();

        this.worldmap = new Worldmap(mapProperties);

        const currentLeader = stateManager.getCurrentLeader();
        const currentWorldmap = stateManager.getCurrentWorldmap();
        if(!currentLeader.name) {
            this.firstStartPanel = new FirstStartPanel();
            this.firstStartPanel.onClose(()=> {
                delete this.firstStartPanel;
                this.leaderCreationPanel = new LeaderCreationPanel();
                this.leaderCreationPanel.onClose(params => {
                    stateManager.updateLeaderName(params.name);
                    if(currentWorldmap.cities.length) {
                        const newWorldmap = stateManager.newWorldmap({});
                        stateManager.setCurrentWorldmap(newWorldmap);
                    }
                    stateManager.updateLeaderWorldmap(stateManager.currentWorldmap.id);
                    this.updateCities(model); //call when player level is updated
                    delete this.leaderCreationPanel;
                });
            });
        }
    }

    beforeShow(model) {
        this.updateCities(model);
    }

    updateCities(model) {
        for(let i = 0; i < model.cities.length; i++) {
            const cityModel = stateManager.getCity(model.cities[i]);
            if(!this.worldmap.cities.find(city => city.id === cityModel.id)) {
                this.worldmap.addCity(cityModel); //city de type etablie
            }
        }

        const leaderId = stateManager.getCurrentLeader().id;
        const level = stateManager.currentLeader.level;
        const spawns = this.worldmap.citySpawns;
        const cities = stateManager.getCityNewCitiesByLevel(level);
        let currentIndex = model.cities.length;
        for(let j = 0; j < cities.length; j++) {
            const newCity = cities[j];
            if(!this.worldmap.cities.find(city => city.name === newCity.name)) {
                this.newCity(spawns[currentIndex * 2], spawns[currentIndex * 2 + 1], 0, newCity.name, leaderId, newCity.goal);
                currentIndex++;
            }
        }
    }


    newCity(x, z, level, name, leaderId, goal) {
        const params = stateManager.newCity({
            level: level, x: x, z: z, name: name,
            type: 'mesopotamia', leader: leaderId, goal: goal
        });
        this.worldmap.addCity(params);
    }

    update(dt) {
        this.worldmap.update(dt);
    }

    mouseMovePress(x, z) {
        this.camera.dragg(x, z);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    mouseUp() {
        this.camera.cleatMove();
    }

    mouseMoveOnMap(x, z) {

    }

    mouseDownRight() {

    }

    mouseClick(x, z, model) {
        if(model) {
            this.entityManagerPanel.open(model);
        }
    }

    mouseWheel(delta) {
        this.camera.mouseWheel(delta);
        this.light.scaleOffset(-this.camera.offsetY);
        this.light.moveTarget(this.camera.targetX, this.camera.targetY, this.camera.targetZ);
    }

    dismount() {
        this.camera = null;
    }

    syncState(model) {
        model.camera.x = this.camera.x;
        model.camera.z = this.camera.z;
        model.camera.zoom = this.camera.zoom;
    }

}

module.exports = ScreenWorldmap;
