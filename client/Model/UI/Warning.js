const ee = require('../../services/eventEmitter');
const wording = require('../../Data/wording');

class Warning {

    constructor() {
        this._displayMessage = this.displayMessage.bind(this);
        this.messages = [];
        this.icons = [];
        ee.on('warning', this._displayMessage);
    }

    dismount() {
        ee.off('warning', this._displayMessage);
    }

    displayMessage(messages) {
        this.updated = true;
        this.messages = [];
        this.icons = [];
        const template = wording('need');
        for(let id of messages.keys()) {
            const message = template.replace('@1', messages.get(id));
            this.messages.push(message);
            this.icons.push(id);
        }
    }
}

Warning.ui = true;
module.exports = Warning;