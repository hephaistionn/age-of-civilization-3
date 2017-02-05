const stateManager = require('../../../services/stateManager');

module.exports = class LeaderCreationPanel {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'leaderCreationPanel pc nodeOverlay';
        this.node.id = model._id;

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeLabelName = document.createElement('div');
        this.nodeLabelName.className = 'label name';
        this.nodeLabelName.textContent = model.labelName;
        this.nodePanel.appendChild(this.nodeLabelName);

        this.nodeInputName = document.createElement('input');
        this.nodeInputName.type = 'text';
        this.nodeInputName.className = 'input name';
        this.nodeInputName.value = model.inputName;
        this.nodePanel.appendChild(this.nodeInputName);

        this.nodeButtonOk = document.createElement('div');
        this.nodeButtonOk.className = 'button ok';
        this.nodeButtonOk.textContent = 'ok';
        this.nodeButtonOk.onclick = () => {
            const params = {
                name: this.nodeInputName.value
            };
            model.valide(params);
        };
        this.nodePanel.appendChild(this.nodeButtonOk);

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
