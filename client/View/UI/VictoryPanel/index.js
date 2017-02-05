const stateManager = require('../../../services/stateManager');

module.exports = class VictoryPanel {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'victoryPanel pc nodeOverlay';
        this.node.id = model._id;

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeMessage = document.createElement('div');
        this.nodeMessage.className = 'message';
        this.nodeMessage.textContent = model.message;
        this.nodePanel.appendChild(this.nodeMessage);

        this.nodeButtonContinue = document.createElement('div');
        this.nodeButtonContinue.className = 'button continue';
        this.nodeButtonContinue.textContent = 'continue';
        this.nodeButtonContinue.onclick = model.continue.bind(model);
        this.nodePanel.appendChild(this.nodeButtonContinue);

        this.nodeButtonWorld = document.createElement('div');
        this.nodeButtonWorld.className = 'button world';
        this.nodeButtonWorld.textContent = 'Worldmap';
        this.nodeButtonWorld.onclick = model.goWorld.bind(model);
        this.nodePanel.appendChild(this.nodeButtonWorld);

        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {
        if(!model.display) {
            this.node.className += ' hide';
        }
    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }

};
