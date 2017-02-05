const stateManager = require('../../../services/stateManager');

module.exports = class FirstStartPanel {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'firstStartPanel pc nodeOverlay';
        this.node.id = model._id;

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeButtonOk = document.createElement('div');
        this.nodeButtonOk.className = 'button ok';
        this.nodeButtonOk.textContent = 'ok';
        this.nodeButtonOk.onclick = model.close;
        this.nodePanel.appendChild(this.nodeButtonOk);

        this.nodeMessage = document.createElement('div');
        this.nodeMessage.className = 'message';
        this.nodeMessage.textContent = model.message;
        this.nodePanel.appendChild(this.nodeMessage);

        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {

    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};
