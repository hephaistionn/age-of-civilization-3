const stateManager = require('../../../services/stateManager');

module.exports = class EntityManagerPanel {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'entityManagerPanel pc nodeOverlay';
        this.node.id = model._id;

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

        this.nodeDescription = null;
        this.nodeVisitButton = null;

        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {
        if(model.opened) {
            if(model.description) this.createDescription(model);
            if(model.yourCity) this.createVisiteButton(model);
            if(model.currentAction) this.createActionButton(model);
            if(model.isRemovable) this.createRemoveButton(model);
            if(model.data) this.createDataList(model);
            this.nodePreview.style.backgroundImage = model.urlPicture;
            this.nodeTitle.textContent = model.title;
            this.node.className = this.node.className.replace(' hide', '');
        } else {
            this.node.className += ' hide';
            if(this.nodeDescription) this.nodePanel.removeChild(this.nodeDescription);
            if(this.nodeVisitButton) this.nodePanel.removeChild(this.nodeVisitButton);
            if(this.nodeActionButton) this.nodePanel.removeChild(this.nodeActionButton);
            if(this.nodeRemoveButton) this.nodePanel.removeChild(this.nodeRemoveButton);
            if(this.nodeDataList) this.nodePanel.removeChild(this.nodeDataList);
        }
    }

    createDataList(model) {
        this.nodeDataList = document.createElement('div');
        this.nodeDataList.className = 'nodeDataList';
        for(let id in model.data ){
            const node = document.createElement('div');
            node.className = 'item';
            const nodePic = document.createElement('div');
            nodePic.className = 'icon '+id;
            const nodeValue = document.createElement('div');
            nodeValue.className = 'value';
            nodeValue.textContent = model.data[id];
            node.appendChild(nodePic);
            node.appendChild(nodeValue);
            this.nodeDataList.appendChild(node);
        }
        this.nodePanel.appendChild(this.nodeDataList);
    }

    createDescription(model) {
        this.nodeDescription = document.createElement('div');
        this.nodeDescription.className = 'description';
        this.nodeDescription.textContent = model.description;
        this.nodePanel.appendChild(this.nodeDescription);
    }

    createVisiteButton(model) {
        this.nodeVisitButton = document.createElement('div');
        this.nodeVisitButton.className = 'button visit';
        this.nodeVisitButton.textContent = 'Go to';
        this.nodeVisitButton.onclick = model.visit.bind(model);
        this.nodePanel.appendChild(this.nodeVisitButton);
    }

    createRemoveButton(model) {
        this.nodeButtonRemove = document.createElement('div');
        this.nodeButtonRemove.className = 'button remove';
        this.nodeButtonRemove.textContent = 'remove';
        this.nodeButtonRemove.onclick = model.remove.bind(model);
        this.nodePanel.appendChild(this.nodeButtonRemove);
    }

    createActionButton(model) {
        this.nodeActionButton = document.createElement('div');
        this.nodeActionButton.className = 'button action';
        this.nodeActionButton.textContent = model.actionLabel;
        this.nodeActionButton.onclick = model.onActionHandler.bind(model);
        this.nodePanel.appendChild(this.nodeActionButton);
    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};
