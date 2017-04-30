const Entity = require('../Entity');

class RoadDirty extends Entity {
    constructor(params) {
        super(params);
    }
}

RoadDirty.description = 'This building increase the enable places for your population';
RoadDirty.cost = {stone: 1};
RoadDirty.require = {wood: 5 /*population: 2*/};
RoadDirty.code = 2;
RoadDirty.isRoad = true;
module.exports = RoadDirty;
