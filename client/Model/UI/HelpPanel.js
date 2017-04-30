const ee = require('../../services/eventEmitter');
const ENTITIES = require('../Engine/Entity/listEntity');

class HelpPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.description = '';
        this.urlPicture = '';
    }

    open(entityId) {
        const entityClass = ENTITIES[entityId];
        this.description = entityClass.description;
        this.urlPicture = 'url("pic/entities/x.jpg")'.replace('x', entityClass.name).toLowerCase();
        this.opened = true;
        this.updated = true;
    }

    close() {
        this.opened = false;
        this.updated = true;
    }
}

HelpPanel.ui = true;
module.exports = HelpPanel;