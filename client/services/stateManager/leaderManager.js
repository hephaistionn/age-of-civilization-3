module.exports = StateManager => {

    StateManager.prototype.newLeader = function newLeader(params) {
        params.id = this.computeUUID('leader_');
        const leader = require('./../../Data/cityDefault')(params);
        this.save(leader);
        this.currentLeader = this.loadCurrentLeader(leader.id);
        this.newWorldmap({});

        //save all Leader created
        const localLeaders = this.load('LocalLeaders') || [];
        if(localLeaders.indexOf(leader.id) !== -1) return;
        localLeaders.push(leader.id);
        this.save(localLeaders, 'LocalLeaders');
    };

    StateManager.prototype.getLeader = function getLeader(id) {
        if(this.leaders[id]) {
            return this.leaders[id];
        } else {
            const leader = this.load(id);
            if(leader) {
                this.leaders[id] = leader;
                return leader;
            } else {
                throw 'No leader with id ' + id;
            }
        }
    };

    StateManager.prototype.loadCurrentLeader = function loadCurrentLeader(id) {
        if(!id) {
            id = this.load('currentLeaderId');
        } else {
            this.save(id, 'currentLeaderId');
        }
        if(id) {
            console.log('load local gamer');
            return this.getLeader(id);
        }
    };

    StateManager.prototype.updateLeaderName = function updateLeaderName(name) {
        this.currentLeader.name = name;
    };

    StateManager.prototype.updateLeaderLevel = function updateLeaderLevel(level) {
        this.currentLeader.level = level;
    };

    StateManager.prototype.updateLeaderCity = function updateLeaderCity(cityId) { //add new city on worldmap of gamer
        if(this.currentLeader.cities.indexOf(cityId) !== -1) return;
        this.currentLeader.cities.push(cityId);
    };

    StateManager.prototype.updateLeaderChallengers = function updateLeaderChallengers(leaderId) {
        if(this.currentLeader.challengers.indexOf(leaderId) !== -1) return;
        this.currentLeader.challengers.push(leaderId);
    };
};