module.exports = params => { return {
    id:params.id,
    name: params.name,
    leader: params.leader,
    level: params.level || 0 ,
    type: params.type || 0,
    mapId: 'test',
    states: {
        population: 0,
        workers: 0,
        explorers: 0
    },
    resources: {
        wood: 200,
        stone: 100,
        meat: 100
    },
    trade: {
        wood: 0,
        stone: 0,
        meat: 0
    },
    x: params.x,
    y: params.y,
    z: params.z,
    camera: {x: 0, z: 0},
    map: {

    }
}};