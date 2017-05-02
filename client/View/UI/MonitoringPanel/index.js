const stateManager = require('../../../services/stateManager');
const wording = require('../../../Data/wording');

module.exports = class MonitoringPanelPC {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'monitoringPanel';
        this.node.id = model._id;

        this.nodePreviewContainer = document.createElement('div');
        this.nodePreviewContainer.className = 'previewContainer';
        this.node.appendChild(this.nodePreviewContainer);

        this.nodeMonitoringContainer = document.createElement('div');
        this.nodeMonitoringContainer.className = 'monitoringContainer nodeOverlay';
        this.node.appendChild(this.nodeMonitoringContainer);

        this.nodeMonitoringPanel = document.createElement('div');
        this.nodeMonitoringPanel.className = 'panel';
        this.nodeMonitoringContainer.appendChild(this.nodeMonitoringPanel);

        this.nodePreviewItems = [];

        for(let i = 0; i < model.previewes.length; i++) {
            const id = model.previewes[i];
            const node = this.createItem(id);
            this.nodePreviewItems.push(node);
            this.nodePreviewContainer.appendChild(node);
        }

        this.nodeButtonOpen = document.createElement('div');
        this.nodeButtonOpen.className = 'button open';
        this.nodeButtonOpen.onclick = model.open.bind(model);
        this.node.appendChild(this.nodeButtonOpen);

        this.nodeButtonClose = document.createElement('div');
        this.nodeButtonClose.className = 'button close';
        this.nodeButtonClose.textContent = 'X';
        this.nodeButtonClose.onclick = model.close.bind(model);
        this.nodeMonitoringPanel.appendChild(this.nodeButtonClose);

        this.nodeButtonWorld = document.createElement('div');
        this.nodeButtonWorld.className = 'button world';
        this.nodeButtonWorld.textContent = 'Worldmap';
        this.nodeButtonWorld.onclick = model.goWorldmap.bind(model);
        this.nodeMonitoringPanel.appendChild(this.nodeButtonWorld);

        const nodeHeaderResources = document.createElement('div');
        nodeHeaderResources.className = 'header resources';
        nodeHeaderResources.textContent = wording('Resources');
        this.nodeMonitoringPanel.appendChild(nodeHeaderResources);
        this.nodeListResource = document.createElement('div');
        this.nodeListResource.className = 'list resources';
        this.nodeMonitoringPanel.appendChild(this.nodeListResource);

        const nodeHeaderSociety = document.createElement('div');
        nodeHeaderSociety.className = 'header society';
        nodeHeaderSociety.textContent = wording('Society');
        this.nodeMonitoringPanel.appendChild(nodeHeaderSociety);
        this.nodeListSociety = document.createElement('div');
        this.nodeListSociety.className = 'list society';
        this.nodeMonitoringPanel.appendChild(this.nodeListSociety);

        this.nodeCityName = document.createElement('div');
        this.nodeCityName.className = 'cityName';
        this.nodeMonitoringPanel.appendChild(this.nodeCityName);

        this.nodeCityLevel = document.createElement('div');
        this.nodeCityLevel.className = 'cityLevel';
        this.nodeMonitoringPanel.appendChild(this.nodeCityLevel);

        this.updateState(model);
        this.add(parent);
    }

    updateDataCity(model){
        this.nodeCityName.textContent  = wording('cityName').replace('@1', model.cityName);
        this.nodeCityLevel.textContent  = wording('cityLevel').replace('@1', model.cityLevel);
    }

    updateMonioringList(){
        const states = stateManager.currentCity.states;

        this.nodeListResource.style.display =  'none';
        while(this.nodeListResource.firstChild) {
            this.nodeListResource.removeChild(this.nodeListResource.firstChild);
        }
        for(let i = 0; i < this.model.resources.length; i++) {
            const id = this.model.resources[i];
            const node = this.createItem(id, states[id], true);
            this.nodeListResource.appendChild(node);
        }
        this.nodeListResource.style.display =  'block';


        this.nodeListSociety.style.display =  'none';
        while(this.nodeListSociety.firstChild) {
            this.nodeListSociety.removeChild(this.nodeListSociety.firstChild);
        }
        for(let i = 0; i < this.model.society.length; i++) {
            const id = this.model.society[i];
            const node = this.createItem(id, states[id]);
            this.nodeListSociety.appendChild(node);
        }
        this.nodeListSociety.style.display =  'block';
    }

    createItem(id, value, trading) {
        const node = document.createElement('div');
        node.className = 'item';
        const nodePic = document.createElement('div');
        nodePic.className = 'icon '+id;
        const nodeValue = document.createElement('div');
        nodeValue.className = 'value';
        nodeValue.textContent = value != undefined ? value : '';
        node.appendChild(nodePic);
        node.appendChild(nodeValue);
        if(trading != undefined) {
            const tradeStatus = stateManager.currentCity.trade[id];
            const nodeStatus = document.createElement('div');
            nodeStatus.className = 'tradeStatus';
            nodeStatus.textContent = this.tradeStatusToWord(tradeStatus);
            nodeStatus.onclick = ()=> {
                this.model.switchTrade(id);
            };
            node.appendChild(nodeStatus)
        }
        return node;
    }

    tradeStatusToWord(value){
        switch (value){
            case 0:
                return 'pas de commerce';
            case 1:
                return 'troquer';
            default:
                return 'vendre'
        }
    }


    updateState(model) {

        if(model.opened) {
            this.showNode(this.nodeMonitoringContainer);
            this.hideNode(this.nodeButtonOpen);
            this.updateMonioringList(model);
            this.updateDataCity(model);
        } else {
            this.hideNode(this.nodeMonitoringContainer);
            this.showNode(this.nodeButtonOpen);
        }

        const states = stateManager.currentCity.states;
        for(let i = 0; i < model.previewes.length; i++) {
            const node = this.nodePreviewItems[i];
            node.lastChild.textContent = states[model.previewes[i]];
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
