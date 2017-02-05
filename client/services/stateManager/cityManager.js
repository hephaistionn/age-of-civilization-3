module.exports = StateManager => {

    const IMPORT = 2;
    const EXPORT = 1;
    const CLOSE = 0;
    let cycle = 0;

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
        if(typeof id === 'string') {
            this.currentCity = this.getCity(id);
        } else {
            this.currentCity = id;
        }
        this.save(this.currentCity.id, 'currentCityId');
    };

    StateManager.prototype.cityGoalAchieved = function cityGoalAchieved() {
        var goal = this.currentCity.goal;
        var states = this.currentCity.states;
        for(let eleId  in goal) {
            if(states[eleId] < goal[eleId]) {
                return false;
            }
        }
        return true;
    };


    StateManager.prototype.cityIsItCompleted = function cityIsItCompleted() {
        return this.currentCity.completed;
    };

    StateManager.prototype.cityOnCompleted = function cityOnCompleted(callback) {
        this.callbackCompleted = callback;
    };


    StateManager.prototype.cityComplete = function cityComplete() {
        this.currentCity.completed = true;
        this.callbackCompleted();
    };

    StateManager.prototype.cityOnLevelUpdated = function cityOnLevelUpdated(callback) {
        this.cbCityLevelUpdated = callback;
    };

    StateManager.prototype.cityUpdateLevel = function cityUpdateLevel() {
        const states = this.currentCity.states;
        let level = 0;
        if(states.population > 0) {
            level = 1;
            if(states.meat > 99 && states.population > 10) {
                level = 2;
                if(states.stone > 400 && states.population > 200) {
                    level = 3;
                }
            }
        }
        if(level !== this.currentCity.level) {
            this.currentCity.level = level;
            this.cbCityLevelUpdated(this.currentCity.level)
        }
    };

    StateManager.prototype.cityAddStone = function updateStone(value) {
        this.currentCity.states.stone += value;
    };

    StateManager.prototype.cityAddWood = function updateWood(value) {
        this.currentCity.states.wood += value;
    };

    StateManager.prototype.cityAddMeat = function updateMeat(value) {
        this.currentCity.states.meat += value;
    };

    StateManager.prototype.cityAddPopulation = function updatePopulation(value) {
        this.currentCity.states.population += value;
    };

    StateManager.prototype.cityAddWorkers = function updateWorkers(value) {
        this.currentCity.states.workers += value;
    };

    StateManager.prototype.cityAddExplorers = function updateExplorers(value) {
        this.currentCity.states.explorers += value;
    };

    StateManager.prototype.cityUpdateTrade = function updateTrade(id) {
        const trade = this.currentCity.trade;
        if(trade[id] === CLOSE) {
            trade[id] = EXPORT;
        } else if(this.trade[id] === EXPORT) {
            trade[id] = IMPORT;
        } else if(this.trade[id] === IMPORT) {
            trade[id] = CLOSE;
        }
    };

    StateManager.prototype.cityUpdate = function cityUpdate(dt) {
        if(cycle > 1000) {
            cycle = 0;
            this.cityUpdateLevel();
            if(this.cityGoalAchieved() && !this.cityIsItCompleted()) {
                this.incraseLeaderLevel();
                this.cityComplete();
            }
        }
        cycle += dt
    }


};
