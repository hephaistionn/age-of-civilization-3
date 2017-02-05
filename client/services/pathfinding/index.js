const Grid = require('./core/Grid');
const Util = require('./core/Util');
const AStarFinder = require('./finders/AStarFinder');
let ENTITIES;
let currentGround;

const finder = new AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

function init(ground, entities) {
    ENTITIES = entities;
    currentGround = ground;
}

function computePath(params) {
    const grid = currentGround.grid;
    let x = Math.floor(params.x);
    let z = Math.floor(params.z);
    const nearests = ENTITIES[params.target].getNearestEntities(x, z);
    const sourceTiles = params.source.getTiles();
    let length = nearests.length;
    const paths = [];
    for(let i = 0; i < length; i++) {
        let entity = nearests[i];
        let targetTiles = entity.getTiles();
        let pathTarget = finder.findPathBetweenArea(sourceTiles, targetTiles, grid);
        if(pathTarget.length > 0)
            paths.push(pathTarget);
    }
    let path = paths[0];
    for(let k = 1; k < paths.length; k++) {
        if(path.length > paths[k].length) {
            path = paths[k];
        }
    }
    //compute height
    if(path) {
        length = path.length;
        for(let k = 0; k < length; k += 3) {
            x = path[k];
            z = path[k + 1];
            path[k + 2] = currentGround.tilesHeight[currentGround.nbTileX * z + x];
        }
        return path;
        //return pf.Util.compressPath(path);
    }
}

function getPathLength(path) {
    let distance = 0;
    const l = path.length;
    for(let i = 0; i < l - 3; i += 3) {
        let dX1 = path[i + 3] - path[i];
        let dZ1 = path[i + 4] - path[i + 1];
        distance += Math.sqrt(dX1 * dX1 + dZ1 * dZ1);
    }
    return distance;
}


const pathfinding = {
    'Grid': Grid,
    'init': init,
    'computePath': computePath,
    'getPathLength': getPathLength
};

module.exports = pathfinding;
