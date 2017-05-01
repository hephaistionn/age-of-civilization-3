const stateManager = require('../../../services/stateManager');

module.exports = class HelpPanel {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'helpPanel pc nodeOverlay';

        this.nodePanel = document.createElement('div');
        this.nodePanel.className = 'panel';
        this.node.appendChild(this.nodePanel);

        this.nodeButtonBack = document.createElement('div');
        this.nodeButtonBack.className = 'button close';
        this.nodeButtonBack.textContent = 'close';
        this.nodeButtonBack.onclick = model.close.bind(model);
        this.nodePanel.appendChild(this.nodeButtonBack);

        this.nodePreview = document.createElement('div');
        this.nodePreview.className = 'preview';
        this.nodePanel.appendChild(this.nodePreview);

        this.nodeTitle = document.createElement('div');
        this.nodeTitle.className = 'title';
        this.nodePanel.appendChild(this.nodeTitle);

        this.nodeDescription = document.createElement('div');
        this.nodeDescription.className = 'description';
        this.nodePanel.appendChild(this.nodeDescription);

        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {
        if(model.opened) {
            this.nodeDescription.textContent = model.description;
            this.nodePreview.style.backgroundImage = model.urlPicture;
            this.nodeTitle.textContent = model.title;
            this.node.className = this.node.className.replace(' hide', '');
        } else {
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
