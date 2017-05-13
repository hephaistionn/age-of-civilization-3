module.exports = params => {
    return {
        id: params.id,
        name: params.name,
        leader: params.leader,
        level: params.level || 0,
        geo: params.geo || 0,
        completed: false,
        mapId: 'test',
        states: {
            population: 0,
            workers: 0,
            inactive: 0,
            wood: 0,
            stone: 0,
            meat: 0
        },
        trade: {
            wood: [],
            stone: [],
            meat: []
        },
        x: params.x,
        y: params.y,
        z: params.z,
        camera: {x: 0, z: 0},
        goal: params.goal,
        desc: params.desc, 
        entities: {}
    };
};