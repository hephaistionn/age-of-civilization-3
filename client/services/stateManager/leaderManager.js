module.exports = StateManager => {

    StateManager.prototype.newLeader = function newLeader(params) {
        params.id = this.computeUUID('leader_');
        const leader = require('./../../Data/leaderDefault')(params);
        this.save(leader);

        //save all Leader created
        const localLeaders = this.load('LocalLeaders') || [];
        if(localLeaders.indexOf(leader.id) !== -1) return;
        localLeaders.push(leader.id);
        this.save(localLeaders, 'LocalLeaders');

        return leader;
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

    StateManager.prototype.loadCurrentLeader = function loadCurrentLeader() {
        const leadersId = this.load('LocalLeaders');
        if(leadersId && leadersId.length) {
            return this.getLeader(leadersId.pop());
        }
    };

    StateManager.prototype.setCurrentLeader = function setCurrentLeader(model) {
        const leadersId = this.load('LocalLeaders');
        leadersId.splice(leadersId.indexOf(model.id), 1);
        leadersId.push(model.id);
        this.save(model, 'LocalLeaders');
        this.currentLeader = model;
    };

    StateManager.prototype.updateLeaderName = function updateLeaderName(name) {
        this.currentLeader.name = name;
        this.save(this.currentLeader);
    };

    StateManager.prototype.updateLeaderWorldmap = function updateLeaderWorldmap(worldmapId) {
        this.currentLeader.worldmapId = worldmapId;
        this.save(this.currentLeader);
    };

    StateManager.prototype.updateLeaderLevel = function updateLeaderLevel(level) {
        this.currentLeader.level = level;
        this.save(this.currentLeader);
    };

    StateManager.prototype.incraseLeaderLevel = function incraseLeaderLevel() {
        this.currentLeader.level += 1;
        this.save(this.currentLeader);
    };

    StateManager.prototype.updateLeaderCity = function updateLeaderCity(cityId) { //add new city on worldmap of gamer
        if(this.currentLeader.cities.indexOf(cityId) !== -1) return;
        this.currentLeader.cities.push(cityId);
        this.save(this.currentLeader);
    };

    StateManager.prototype.updateLeaderChallengers = function updateLeaderChallengers(leaderId) {
        if(this.currentLeader.challengers.indexOf(leaderId) !== -1) return;
        this.currentLeader.challengers.push(leaderId);
        this.save(this.currentLeader);
    };
};