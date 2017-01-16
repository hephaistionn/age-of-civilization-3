const THREE = require('../../../services/threejs');
const materialWorldmap = require('./../Material/materialWorldmap');
const ee = require('../../../services/eventEmitter');

module.exports = Worldmap => {

    Worldmap.prototype.initGround = function initGround(model) {
        this.materialWorldmap = materialWorldmap;

        this.materialWorldmap.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialWorldmap.uniforms.textureSize.value = model.nbPointX * this.tileSize;
        this.materialWater = new THREE.MeshBasicMaterial({color: 0x006699, transparent: true, opacity: 0.80 });
        //this.materialWorldmap = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe : true});

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

        this.initAreaMap(model);
        return mapMesh;
    };

    Worldmap.prototype.createWater = function createWater(nbTileX, nbTileZ) {
        const xSize = nbTileX * this.tileSize * 4;
        const zSize = nbTileZ * this.tileSize * 4;
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

        const  tileSize = this.tileSize/1;

        const xSize = nbXTiles * tileSize;
        const zSize = nbZTiles * tileSize;

        let chunkGeometry = new THREE.PlaneGeometry(xSize, zSize, nbXTiles, nbZTiles);

        const vertices = chunkGeometry.vertices;
        const length = vertices.length;
        for(let i = 0; i < length; i++) {
            let pointsHeights = model.pointsHeights[i];
            vertices[i].y = pointsHeights / 255 * this.tileHeight;
        }

        const lengthFace = chunkGeometry.faces.length;
        const filterdFaces = [];
        let face;
        for(let i = 0; i < lengthFace; i++) {
            face = chunkGeometry.faces[i];
            if(vertices[face.a].y > 0.1 && vertices[face.b].y > 0.1 && vertices[face.c].y > 0.1 ) {
                filterdFaces.push(face.clone());
            }
        }
        chunkGeometry.faces = filterdFaces;

        //const modifierSubdivi = new THREE.SubdivisionModifier(1);
        //modifierSubdivi.modify( chunkGeometry );

        const modiferSimplify = new THREE.SimplifyModifier();
        chunkGeometry = modiferSimplify.modify( chunkGeometry,Math.round(chunkGeometry.vertices.length*0.6) );

        chunkGeometry.computeVertexNormals();
        return chunkGeometry;
    };

    Worldmap.prototype.refreshTexture = function refreshTexture(model) {
        this.materialWorldmap.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialWorldmap.uniforms.textureSize.value = model.nbPointX * this.tileSize;
    };


    Worldmap.prototype.initAreaMap = function initAreaMap(model) {
        THREE.loadCanvasTexture( model.mapArea,  (context, canvas) => {
            this.cavasArea = canvas;
            this.contextArea = context;
            this.imageArea = context.getImageData(0, 0, context.width, context.height);
            this.computeAreaMap(model);
        });
    };

    Worldmap.prototype.computeAreaMap = function computeAreaMap(model) {

        const revealed = [1,2,3,4,5,6,7];
        const currentSelected  =  [8,9,10,11];

        if(!this.imageArea) return;

        const data = this.imageArea.data;
        const length  = data.length;
        let codeArea;
        for(let i = 0; i < length; i=i+4) {
            codeArea = data[i];
            if(revealed.indexOf(codeArea)!==-1){
                data[i+1] = 255;
            }else if(currentSelected.indexOf(codeArea)!==-1){
                data[i+1] = 153;
            } else{
                data[i+1] = 50;
            }
        }
        this.contextArea.putImageData(this.imageArea, 0, 0);
        this.materialWorldmap.uniforms.textureArea.value = THREE.loadTexture(this.cavasArea);
    };

};
