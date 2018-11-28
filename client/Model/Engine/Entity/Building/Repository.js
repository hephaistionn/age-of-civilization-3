const Entity = require('../Entity');
const ee = require('../../../../services/eventEmitter');

class Repository extends Entity {

    constructor(params) {
        super(params);
        this.starter = params.starter||false; //when game begin this is not real repository
        if(this.starter) {
        	if(params.states)
        		this.states = { wood: params.states.wood, stone: params.states.stone, meat: params.states.meat };
        	else
        		this.states = { wood: 60, stone: 60, meat: 0 }; 
        }else{
        	if(params.states)
        		this.states = { wood: params.states.wood, stone: params.states.stone, meat: params.states.meat, workers: 2 };
        	else
        		this.states = { wood: 0, stone: 0, workers: 2, meat: 0  };
        } 
        
        this.statesMax = { wood: 300, stone: 300, meat: 50 };
        this.capacity = 650;

        this._getStates = callback => callback(this.states);
        ee.on('getCityStates', this._getStates);
    }

    dismount(){
        ee.off('getCityStates', this._getStates);    
        const index = this.constructor.instances.indexOf(this);
        this.constructor.instances.splice(index, 1);
    }
}

Repository.selectable = true;
Repository.description = 'This building increase the enable places for your population';
Repository.tile_x = 1;
Repository.tile_z = 1;
Repository.walkable = 0;
Repository.cost = {wood: 5};
Repository.require = {inactive: 2}; 
Repository.enabled = {wood: 5};
Repository.displayed = ['wood', 'stone'];
Repository.constuctDuration = 1000;
Repository.instances = [];

module.exports = Repository;