const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');
const ENTITIES = require('../Engine/Entity/listEntity');

class BuildingMenu {

    constructor(config) {
        this.categories = {
            resource: ['House'],
            factory: ['House'],
            citizen: ['House'],
            culture: ['Market'],
            state: [
                'House',
                'Market',
                'WoodCutterHut',
                'Attic',
                'Barrack',
                'HunterHut',
                'LeaderHut',
                'Repository',
                'StoneMine',
                'RoadDirty',
                'RoadStone']
        };
        this.currentCategory = [];
        this.currentCategoryId = '';
        this.currentFocus = null;
        this.displayed = true;
        this.isCollapsed = true;
        this.updated = false;
        this._id = 0;
    }

    open() {
        this.displayed = true;
        this.isCollapsed = true;
        this.updated = true;
    }

    close() {
        this.displayed = false;
        this.currentCategory = [];
        if(this._close)this._close();
        this.updated = true;
    }

    expand() {
        this.isCollapsed = false;
        this.updated = true;
    }

    collapse() {
        this.currentCategory = [];
        this.isCollapsed = true;
        this.updated = true;
    }


    openCategory(categoryId) {
        this.isCollapsed = false;
        this.currentCategoryId = categoryId;
        this.updateCurrentCategory();
        this.updated = true;
    }

    updateCurrentCategory() {
        const category = this.categories[this.currentCategoryId];
        if(!category) return;
        const filterList = category.filter(this.filterEnableBuilding);
        this.currentCategory = filterList.map(id=>ENTITIES[id]);
    }

    filterEnableBuilding(entityId) {
        const Entity = ENTITIES[entityId];
        if(!Entity) return true;
        return Entity.available();
    }

    onClickBuilding(fct) {
        this._onClickBuilding = entityId => {
            this.currentFocus === entityId ? this.currentFocus = null : this.currentFocus = entityId;
            const Entity = ENTITIES[entityId];
            const required = Entity.checkState();
            if(required.size === 0) {
                fct(entityId);
                this.updated = true;
            } else {
                ee.emit('warning', required);
            }
        };
    }

    _onClickHelp(entityId) {
        ee.emit('showHelper', entityId);
    }

    _onClickExpand() {
        this.expand();
    }

    _onClickCollapse() {
        this.collapse();
    }

    _onClickOpen() {
        this.open();
    }

    _onClickClose() {
        this.close();
    }

    _onClickBuilding() {
    }

    _onClickCategory(categoryId) {
        this.openCategory(categoryId)
    }

}

BuildingMenu.ui = true;
module.exports = BuildingMenu;
