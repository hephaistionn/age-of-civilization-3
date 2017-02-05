const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class WorldmapMenu {

    constructor(config) {
        this.constructMode = false;
        this.updated = false;
        this._id = 0;
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        const model = stateManager.loadCurrentCity();
        ee.emit('openScreen', 'ScreenCity', model);
    }

}

WorldmapMenu.ui = true;
module.exports = WorldmapMenu;