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

function computePath(source, targetType, tileType) {
    const grid = currentGround.grid;
    let x = Math.floor(source.x);
    let z = Math.floor(source.z);
    if(!targetType) return {};
    const nearests = ENTITIES[targetType].getNearestEntities(x, z);
    const sourceTiles = source.getTiles();
    let length = nearests.length;
    const paths = [];
    for(let i = 0; i < length; i++) {
        let entity = nearests[i];
        let targetTiles = entity.getTiles();
        let pathTarget = finder.findPathBetweenArea(sourceTiles, targetTiles, grid, tileType);
        if(pathTarget.length > 0)
            paths.push(pathTarget);
    }
    if(paths.length === 0){
        return {}
    }

    let path = paths[0];
    let targetId = nearests[0]._id;
    for(let k = 1; k < paths.length; k++) {
        if(path.length > paths[k].length) {
            path = paths[k];
            targetId = nearests[k]._id
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
        return {
            path:path,
            targetId:targetId,
            sourceId: source._id
        };
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

function revert(path) {
    const l = path.length;
    const  newPath = [];
    for(let i = l-1; i > -1; i -= 3) {
        newPath.push(path[i-2]);
        newPath.push(path[i-1]);
        newPath.push(path[i]);
    }
    return newPath;
}


const pathfinding = {
    'Grid': Grid,
    'init': init,
    'computePath': computePath,
    'getPathLength': getPathLength,
    'revert' : revert
};

module.exports = pathfinding;
