const stateManager = require('../../services/stateManager');
class Screen {

    constructor(model, mapProperties) {
        this.components = new Map();
        this.dynamicComponents = new Map();
        this.initComponents(model, mapProperties);
    }

    add(component) {
        component._id = component._id || this.generateKey();
        this.components.set(component._id, component);
        if(component.update) {
            this.dynamicComponents.set(component._id, component);
        }
    }

    remove(component) {
        this.components.delete(component._id);
        if(component.update) {
            this.dynamicComponents.delete(component._id);
        }
        if(component.onRemove) {
            component.onRemove();
        }
    }

    get(id) {
        return this.components.get(id);
    }

    update(dt) {
        const components = this.components;
        for(let id of components.keys()) {
            if(components.get(id)._cycle) {
                components.get(id).updateTimer(dt);
            }
        }
        stateManager.cityUpdate(dt);
    }

    syncState(model) {

    }

    dismount() {

    }

    generateKey() {
        var key = 0;
        while(this.components.has(key)) {
            key = Math.floor((1 + Math.random()) * 0x100000);
        }
        return key;
    }

}

module.exports = Screen;
