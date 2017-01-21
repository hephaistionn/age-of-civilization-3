

module.exports = StateManager => {

    StateManager.prototype.newWorldmap = function newWorldmap(params) {
        params.id = this.computeUUID('worldmap_');
        const worldmap = require('./../../Data/worldmapDefault')(params);
        this.currentWorldmap = worldmap;
        this.save(worldmap);
        return worldmap;
    };

    StateManager.prototype.getWorldmap = function getWorldmap(id) {
        if(this.worldmaps[id]) {
            return this.worldmaps[id];
        } else {
            const worldmap = this.load(id);
            if(worldmap) {
                this.worldmaps[id] = worldmap;
                return worldmap;
            } else {
                throw 'No worldmap with id ' + id;
            }
        }
    };

    StateManager.prototype.setWorldmapCity = function setWorldmapCity(id) {
        if(this.currentWorldmap.cities.indexOf(id) !== -1) return;
        this.currentWorldmap.cities.push(id);
        this.save(this.currentWorldmap);
    };


    StateManager.prototype.loadCurrentWorldmap = function loadCurrentWorldmap() {
        if(this.currentLeader) {
            return this.getWorldmap(this.currentLeader.worldmapId);
        }
    };

    StateManager.prototype.setCurrentWorldmap = function setCurrentWorldmap(id) {
        if(typeof id === 'string'){
            this.currentWorldmap = this.getWorldmap(id);
            this.updateLeaderWorldmap(id);
        }else{
            this.currentWorldmap = id;
            this.updateLeaderWorldmap(id.id);
        }
    };

    StateManager.prototype.getCityNewCitiesByLevel = function getCityNewCitiesByLevel(level) {
        const areas = {
            areaDefault :require('../../Data/areaDefault')
        };
        const stepCities = areas[this.currentWorldmap.areaMapId];
        return [].concat.apply([], stepCities.slice(0,level));
    };

};