const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.constructMode = false;
        this.updated = false;

    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        const model = stateManager.loadCurrentCity();
        ee.emit('openScreen', 'ScreenMap', model);
    }

};
