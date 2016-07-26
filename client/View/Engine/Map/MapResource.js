const THREE = require('../../../services/threejs');

const Entities = require('../Entity/list').resources;

module.exports = Map=> {

    Map.prototype.initResource = function initResource(model) {

        this.resources = {};
        for(let type in Entities) {
            this.resources[type] = [];
        }

        Entities['EntityTree'].ready = () => {
            this.updateResource(model, 'EntityTree');
        };
        if(!this.resources.trees)
            Entities['EntityTree'].ready();

    };

    Map.prototype.updateResource = function updateResource(model, forceId) {

        const entityId = model.lastEntityIdUpdated || forceId;

        const groupView = this.resources[entityId];
        if(!groupView) return;
        const groupModel = model.resources[entityId];

        let lengthModel = groupModel.length;

        for(let i = 0; i < lengthModel; i++) {

            let entityView = groupView[i];
            let entityModel = groupModel[i];

            if(!entityView) {
                let entityView = new Entities[entityId](entityModel, this.tileSize, this.maxHeight);
                groupView[i] = entityView;
                let chunkX = Math.floor(entityModel.x / this.tileByChunk);
                let chunkZ = Math.floor(entityModel.z / this.tileByChunk);
                this.chunks[chunkX][chunkZ].add(entityView.element);
            } else if(entityView.model !== entityModel) {
                groupView.splice(i, 1);
                entityView.element.parent.remove(entityView.element);
                i--;
            }
        }

        let lengthView = groupView.length;
        if(lengthView > lengthModel) {
            for(let i = lengthModel; i < lengthView; i++) {
                let entityView = groupView[i];
                entityView.element.parent.remove(entityView.element);
            }
            groupView.splice(lengthModel - 1, lengthView);
        }

    };
};
