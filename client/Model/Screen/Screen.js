const stateManager = require('../../services/stateManager');
class Screen {

    constructor() {
        this.components = new Map();
        //this.initComponents(model, mapProperties);
    }

    initComponents(model, mapProperties) {
        //must be overWrite
    }

    add(component) {
        component._id = component._id || this.generateKey();
        this.components.set(component._id, component);
    }

    remove(component) {
        this.components.delete(component._id);
        if(component.dismount) {
            component.dismount();
        }
    }

    get(id) {
        return this.components.get(id);
    }

    update(dt) {
        const components = this.components;
        for(let id of components.keys()) {
            if(components.get(id).cycle) {
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
