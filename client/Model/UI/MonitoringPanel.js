const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class MonitoringPanel {

    constructor() {
        this.opened = false;
        this.previewes = ['wood', 'stone', 'meat', 'population'];
        this.resources = ['wood', 'stone', 'meat'];
        this.society = ['population', 'workers'];
        this.updated = false;
        this.stateManager = stateManager;
        this._id = 0;
    }

    open() {
        if(this.opened === true) return;
        this.opened = true;
        this.updated = true;
    }

    close() {
        if(this.opened === false) return;
        this.opened = false;
        this.updated = true;
    }

    switchTrade(id) {
        this.stateManager.switchTrade(id);
        this.updated = true;
    }

    update() {
        this.updated = true;
    }

    goWorldmap() {
        this.close();
        const model = stateManager.loadCurrentWorldmap();
        ee.emit('openScreen', 'ScreenWorldmap', model);
    }

}

MonitoringPanel.ui = true;
module.exports = MonitoringPanel;
