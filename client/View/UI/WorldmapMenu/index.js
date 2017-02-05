const stateManager = require('../../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'worldmapMenu pc';
        this.node.id = model._id;

        this.nodeButtonBack = document.createElement('div');
        this.nodeButtonBack.className = 'button back';
        this.nodeButtonBack.textContent = 'Back';
        this.nodeButtonBack.onclick = model.back.bind(model);
        this.node.appendChild(this.nodeButtonBack);

        this.updateState(model);
        this.add(parent);
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

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};
