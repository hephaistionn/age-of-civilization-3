const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.description = '';
        this.currentEntity = null;
        this.updated = false;
        this._onBuild = null;
        this._id = 0;
    }

    open(entity) {
        if(!entity.constructor.selectable) return;
        this.description = entity.constructor.description;
        if(entity.onAction) {
            this.currentAction = entity.onAction.bind(entity);
        } else {
            this.currentAction = null;
        }
        this.actionLabel = entity.constructor.actionLabel;
        this.opened = true;
        this.yourCity = entity.leader === stateManager.getCurrentLeader().id;
        this.currentEntity = entity;
        this.updated = true;
    }

    close() {
        this.description = '';
        this.opened = false;
        this.currentEntity = null;
        this.updated = true;
    }

    onActionHandler() {
        if(this.currentAction) {
            const entityId = this.currentAction();
            if(entityId) this._onBuild(entityId);
        }
    }

    onBuild(fct) {
        this._onBuild = fct;
    }

    visit() {
        const cityId = this.currentEntity.cityId;
        const model = stateManager.getCity(cityId);
        stateManager.setCurrentCity(model);
        this.close();
        ee.emit('openScreen', 'ScreenCity', model);
    }

}

EntityManagerPanel.ui = true;
module.exports = EntityManagerPanel;