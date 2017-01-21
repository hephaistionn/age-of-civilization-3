module.exports = StateManager => {

    const IMPORT = 2;
    const EXPORT = 1;
    const CLOSE = 0;

    StateManager.prototype.newCity = function newCity(params) {
        params.id = this.computeUUID('city_');
        const city = require('./../../Data/cityDefault')(params);
        this.save(city);
        this.cities[city.id] = city;
        this.setWorldmapCity(city.id);
        return city;
    };

    StateManager.prototype.getCity = function getCity(id) {
        if(this.cities[id]) {
            return this.cities[id];
        } else {
            const city = this.load(id);
            if(city) {
                this.cities[id] = city;
                return city;
            } else {
                throw 'No City with id ' + id;
            }
        }
    };

    StateManager.prototype.loadCurrentCity = function loadCurrentCity() {
        const id = this.load('currentCityId');
        if(id) {
            this.currentCity = this.getCity(id);
            return this.currentCity;
        }
    };

    StateManager.prototype.setCurrentCity = function setCurrentCity(id) {
        if(typeof id === 'string'){
            this.currentCity = this.getCity(id);
        }else{
            this.currentCity = id;
        }
    };

    StateManager.prototype.updateStone = function updateStone(value) {
        this.currentCity.resources.stone += value;
    };

    StateManager.prototype.updateWood = function updateWood(value) {
        this.currentCity.resources.wood += value;
    };

    StateManager.prototype.updateMeat = function updateMeat(value) {
        this.currentCity.resources.meat += value;
    };

    StateManager.prototype.updatePopulation = function updatePopulation(value) {
        this.currentCity.states.population += value;
    };

    StateManager.prototype.updateWorkers = function updateWorkers(value) {
        this.currentCity.states.workers += value;
    };

    StateManager.prototype.updateExplorers = function updateExplorers(value) {
        this.currentCity.states.explorers += value;
    };

    StateManager.prototype.updateTrade = function updateTrade(id) {
        const trade = this.currentCity.trade;
        if(trade[id] === CLOSE) {
            trade[id] = EXPORT;
        } else if(this.trade[id] === EXPORT) {
            trade[id] = IMPORT;
        } else if(this.trade[id] === IMPORT) {
            trade[id] = CLOSE;
        }
    };


};
