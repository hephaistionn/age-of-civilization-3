const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class LeaderCreationPanel {

    constructor(config) {
        this.inputName = 'SARGON';
        this.labelName = 'leader name';
        this.valide = null;
        this.updated = false;
        this._id = 0;
    }

    onClose(fct) {
        this.valide = fct;
    }

}

LeaderCreationPanel.ui = true;
module.exports = LeaderCreationPanel;