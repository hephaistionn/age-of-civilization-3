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
        this.cityLevel = 0;
        this.urlPicture = '';
        this.goal = stateManager.currentCity.goal;
        this._id = 0;
        this._update = ()=>{
            this.updated = true;
        }
        ee.on('statesUpdated', this._update);
    }

    open() {
        if (this.opened === true) return;
        this.opened = true;
        this.updated = true;
        this.cityLevel = stateManager.currentCity.level;
        this.urlPicture = 'url("pic/entities/@x@y.jpg")';
        this.urlPicture = this.urlPicture.replace('@x', 'city').toLowerCase();
        this.urlPicture = this.urlPicture.replace('@y', stateManager.currentCity.level);
    }

    close() {
        if (this.opened === false) return;
        this.opened = false;
        this.updated = true;
    }

    switchTrade(id) {
        stateManager.cityUpdateTrade(id);
<<<<<<< HEAD
        this.updated = true;
    }

    update() {
=======
>>>>>>> 7feb13bd2ed4d5cb8f2bedf5ea615377b3abcff3
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