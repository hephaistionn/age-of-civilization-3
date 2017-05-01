const stateManager = require('../../../services/stateManager');

module.exports = class Warning {

    constructor(model, parent) {
        this.model = model;
        this.node = document.createElement('div');
        this.node.className = 'warning hide';
        this.node.id = model._id;
        this.timer = null;
        this.add(parent);
    }

    updateState(model) {
        while(this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }

        for(let i = 0; i < model.messages.length; i++) {

            const node = document.createElement('div');
            node.className = 'message';
            node.textContent = model.messages[i];

            const nodePic = document.createElement('div');
            nodePic.className = 'icon ' + model.icons[i];
            node.appendChild(nodePic);
            this.node.appendChild(node);
        }
        this.node.className = 'warning transitionByLeft';
        this.timer = setTimeout(()=> {
            this.node.className = 'warning hide';
        }, 4000);
    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        clearTimeout(this.timer);
        parent.dom.removeChild(this.node);
    }
};
