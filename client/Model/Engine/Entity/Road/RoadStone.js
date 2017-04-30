const Entity = require('../Entity');

class RoadStone extends Entity {
    constructor(params) {
        super(params);
    }
}

RoadStone.description = 'This building increase the enable places for your population';
RoadStone.cost = {stone: 2};
RoadStone.require = {wood: 5 /*population: 16*/};
RoadStone.code = 3;
RoadStone.isRoad = true;
module.exports = RoadStone;
