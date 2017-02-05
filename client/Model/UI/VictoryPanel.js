const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class VictoryPanel {

    constructor() {
        this.message = "Victory !";
        this.updated = false;
        this.display = true;
        this._id = 0;
    }

    continue() {
        this.display = false;
        this.updated = true;
    }

    goWorld() {
        const model = stateManager.loadCurrentWorldmap();
        ee.emit('openScreen', 'ScreenWorldmap', model);
    }
}

VictoryPanel.ui = true;
module.exports = VictoryPanel;