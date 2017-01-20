const stateManager = require('../../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'worldmapMenu pc';

        this.nodeButtonBack = document.createElement('div');
        this.nodeButtonBack.className = 'button back';
        this.nodeButtonBack.textContent = 'Back';
        this.nodeButtonBack.onclick = model.back.bind(model);
        this.node.appendChild(this.nodeButtonBack);

        this.updateState(model);
    }

    updateState(model) {

        if(stateManager.currentCity) {
            this.showNode(this.nodeButtonBack);
        } else {
            this.hideNode(this.nodeButtonBack);
        }
    }

    showNode(node) {
        const index = node.className.indexOf('hide');
        if(index !== -1) {
            node.className = node.className.replace(' hide', '');
        }
    }

    hideNode(node) {
        if(node.className.indexOf('hide') === -1) {
            node.className += ' hide';
        }
    }

    update() {
    }
};
