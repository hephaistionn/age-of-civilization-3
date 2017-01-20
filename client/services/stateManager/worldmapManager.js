module.exports = StateManager => {

    StateManager.prototype.newWorldmap = function newWorldmap(params) {
        const id = this.computeUUID('worldmap_');
        const worldmap = {
            id: id,
            mapId: 'worldmap4',
            areaMapId: 'worldmap4_area',
            challengers: [],
            cities: [],
            camera: {x: 0, z: 0}
        };

        //if there are no players, the map should not be persistent. it is linked to nobody.
        if(this.currentLeader) {
            this.save(worldmap);
            this.worldmaps[id] = worldmap;
            this.currentLeader.worldmapId = id;
            this.currentWorldmap = worldmap;
        }

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
    };


    StateManager.prototype.loadCurrentWorldmap = function loadCurrentWorldmap() {
        if(this.currentLeader) {
            return this.getWorldmap(this.currentLeader.worldmapId);
        } else {
            return this.newWorldmap();
        }
    };

    StateManager.prototype.getCityNewCitiesByLevel = function getCityNewCitiesByLevel(level) {
        const stepCities =  [[
            {name:'ville1'}
        ],[
            {name:'ville2'},
            {name:'ville3'}
        ]];
        return [].concat.apply([], stepCities.slice(0,level));
    };

};