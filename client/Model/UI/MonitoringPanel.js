const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class MonitoringPanel {

    constructor() {
        this.opened = false;
        this.previewes = ['wood', 'stone', 'meat', 'population'];
        this.resources = ['wood', 'stone', 'meat'];
        this.society = ['population', 'workers'];
        this.updated = false;
        this.cityName = stateManager.currentCity.name;
        this.cityLevel =  0;
        this._id = 0;
        this._update = ()=>{
            this.updated = true;
        }
        ee.on('statesUpdated', this._update);
    }

    open() {
        if(this.opened === true) return;
        this.opened = true;
        this.updated = true;
        this.cityLevel = stateManager.currentCity.level;
    }

    close() {
        if(this.opened === false) return;
        this.opened = false;
        this.updated = true;
    }

    switchTrade(id) {
        stateManager.cityUpdateTrade(id);
        this.updated = true;
    }

    goWorldmap() {
        this.close();
        const model = stateManager.loadCurrentWorldmap();
        ee.emit('openScreen', 'ScreenWorldmap', model);
    }

    dismount() {
        ee.off('statesUpdated', this._update);
    }

}

MonitoringPanel.ui = true;
module.exports = MonitoringPanel;
