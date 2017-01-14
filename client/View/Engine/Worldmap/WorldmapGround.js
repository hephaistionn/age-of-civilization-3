const THREE = require('../../../services/threejs');
const materialWorldmap = require('./../Material/materialWorldmap');
const ee = require('../../../services/eventEmitter');

module.exports = Worldmap => {

    Worldmap.prototype.initGround = function initGround(model) {
        this.materialWorldmap = materialWorldmap;

        this.materialWorldmap.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialWorldmap.uniforms.textureSize.value = model.nbPointX * this.tileSize;
        this.materialWater = new THREE.MeshBasicMaterial({color: 0x006699, transparent: true, opacity: 0.85 });

        const nbPointX = model.nbPointX;
        const nbPointZ = model.nbPointZ;
        const nbTileX = model.nbTileX;
        const nbTileZ = model.nbTileZ;

        this.mapGeo = this.createSurface(nbTileX, nbTileZ, model);
        const mapMesh = new THREE.Mesh(this.mapGeo, this.materialWorldmap);
        const waterMesh = this.createWater(nbTileX, nbTileZ, mapMesh);

        mapMesh.add(waterMesh);
        mapMesh.position.set(0, 0, 0);
        mapMesh.updateMatrixWorld();
        mapMesh.matrixAutoUpdate = false;
        mapMesh.matrixWorldNeedsUpdate = false;
        mapMesh.receiveShadow = true;

        this.touchSurface = [mapMesh];
        this.waterMesh = waterMesh;

        return mapMesh;
    };

    Worldmap.prototype.createWater = function createWater(nbTileX, nbTileZ) {
        const xSize = nbTileX * this.tileSize * 2;
        const zSize = nbTileZ * this.tileSize * 2;
        const waterGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, 1, 1);
        let waterMesh = new THREE.Mesh(waterGeometry, this.materialWater);
        waterMesh.position.set(-xSize / 4, 3, -zSize / 4);
        waterMesh.updateMatrix();
        waterMesh.updateMatrixWorld();
        waterMesh.matrixAutoUpdate = false;
        waterMesh.matrixWorldNeedsUpdate = false;
        waterMesh.receiveShadow = true;
        return waterMesh;
    };

    Worldmap.prototype.createSurface = function createSurface(nbXTiles, nbZTiles, model) {
        const xSize = nbXTiles * this.tileSize;
        const zSize = nbZTiles * this.tileSize;

        const chunkGeometry = new THREE.PlaneBufferGeometry(xSize, zSize, nbXTiles, nbZTiles);

        const position = chunkGeometry.attributes.position;
        const posArray = position.array;
        const length = position.count;
        const normalArray = new Float32Array(length * 3);

        for(let i = 0; i < length; i++) {
            let tileX = posArray[i * 3] / this.tileSize;
            let tileZ = posArray[i * 3 + 2] / this.tileSize;
            let index = tileZ * model.nbPointX + tileX;

            let pointsHeights = model.pointsHeights[index] || 0;
            posArray[i * 3 + 1] = pointsHeights / 255 * this.tileHeight;

            let dx = model.pointsNormal[index * 3] / 127 / this.tileSize;
            let dy = model.pointsNormal[index * 3 + 1] / 127 / this.tileHeight;
            let dz = model.pointsNormal[index * 3 + 2] / 127 / this.tileSize;
            let l = Math.sqrt(dx * dx + dy * dy + dz * dz);

            normalArray[i * 3] = dx / l;
            normalArray[i * 3 + 1] = dy / l;
            normalArray[i * 3 + 2] = dz / l;
        }

        chunkGeometry.addAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
        chunkGeometry.attributes.position.needsUpdate = true;
        return chunkGeometry;
    };

    Worldmap.prototype.refreshTexture = function refreshTexture(model) {
        this.materialWorldmap.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialWorldmap.uniforms.textureSize.value = model.nbPointX * this.tileSize;
    }


};
