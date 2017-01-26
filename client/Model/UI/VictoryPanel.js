const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class VictoryPanel {

    constructor() {
        this.type = 'UI';
        this.message = "Victory !";
        this.updated = false;
        this.display = true;
    }

    continue() {
        this.display = false;
        this.updated = true;
    }

    goWorld() {
        const model = stateManager.loadCurrentWorldmap();
        ee.emit('openScreen', 'ScreenWorldmap', model);
    }
};
