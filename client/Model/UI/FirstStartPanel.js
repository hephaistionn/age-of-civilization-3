const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

class FirstStartPanel {

    constructor(config) {
        this.message = "welcome to Age of Civilization";
        this.picture = '';
        this.fct = null;
        this.updated = false;
        this._id = 0;
    }

    onClose(fct) {
        this.close = fct;
    }

}

FirstStartPanel.ui = true;
module.exports = FirstStartPanel;