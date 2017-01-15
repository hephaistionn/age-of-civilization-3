module.exports = class PixelMap {

    constructor() {
        this.tileSize = 0;
        this.heightMax = 4;
    }

    compute(url, cb) {
        return this.loadImage(url, (context, canvas)=> {
            const dataMap = this.getData(context);
            dataMap.canvas = canvas;
            cb(dataMap);
        })
    }

    loadImage(url, cb) {
        let image = new Image();
        image.onload = function() {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            let context = canvas.getContext('2d');
            context.width = this.width;
            context.height = this.height;
            context.drawImage(this, 0, 0);
            cb(context, canvas);
        };
        image.src = url;
    }

    getData(context) {
        const image = context.getImageData(0, 0, context.width, context.height);
        let imageData = image.data;
        let size = context.height * context.width;
        let data = {};
        data.nbPointZ = context.height;
        data.nbPointX = context.width;
        data.nbTileZ = context.height - 1;
        data.nbTileX = context.width - 1;
        const dataHeights = new Uint8Array(size);
        const dataResources = new Uint8Array(size);
        let index = 0;
        for(let i = 0; i < size; i++) {
            index = i * 4;
            dataHeights[i] = imageData[index + 3];
            dataResources[i] = imageData[index] > 240 ? imageData[index] : 0;
        }
        this.extrapolation(imageData, data.nbPointX,  data.nbPointZ);
        this.addGrid(imageData, data.nbPointX,  data.nbPointZ);

        data.pointsHeights = dataHeights;
        data.tilesResource = this.pixelByTile(dataResources, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesColor = imageData;
        data.tilesHeight = this.averageByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        data.tilesTilt = this.rangeByTile(dataHeights, data.nbTileX, data.nbTileZ, data.nbPointX);
        context.putImageData(image, 0, 0);
        return data;
    }

    addGrid(dataColor, sizeX, sizeZ){
        for(let x = 0; x < sizeX; x++) {
            for(let z = 0; z < sizeZ; z++) {
                const i = (z * sizeX + x) * 4;
                if(x % 2 === 1 && z % 2 === 0||x % 2===0 && z % 2===1){
                    dataColor[i] = dataColor[i] * 0.8;
                    dataColor[i + 1] = dataColor[i + 1] * 0.8;
                    dataColor[i + 2] = dataColor[i + 2] * 0.8;
                }
            }
        }
    }

    extrapolation(dataColor, sizeX, sizeZ ) {
        function average(x, z, data) {
            let cnt = 0;
            let RSum = 0;
            let GSum = 0;
            let BSum = 0;
            for(let dx = -1; dx < 2; dx++) {
                for(let dz = -1; dz < 2; dz++) {
                    const xt = x + dx;
                    const zt = z + dz;
                    if(xt > -1 && xt < sizeX && zt > -1 && zt < sizeZ && (dx != 0 || dz != 0)) {
                        const i = (zt * sizeX + xt)*4;
                        const red = data[i];
                        if(red <= 240) {
                            cnt++;
                            const green = data[i + 1];
                            const blue = data[i + 2];
                            RSum += red;
                            GSum += green;
                            BSum += blue;
                        }
                    }
                }
            }
            const i = (z * sizeX + x)*4;
            data[i] = cnt === 0 ? 0 : RSum / cnt;
            data[i + 1] = cnt === 0 ? 163 : GSum / cnt;
            data[i + 2] = cnt === 0 ? 70 : BSum / cnt;
        }

        for(let x = 0; x < sizeX; x++) {
            for(let z = 0; z < sizeZ; z++) {
                const i = (z * sizeX + x)*4;
                if(dataColor[i] > 240) {
                    average(x, z, dataColor);
                }
                dataColor[i+3] = 255;
            }
        }
    }

    rangeByTile(points, nbTileX, nbTileZ, nbPointX) {

        const tilts = new Uint8Array(nbTileX * nbTileZ);
        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index1 = z * nbPointX + x;
                let index2 = z * nbPointX + (x + 1);
                let index3 = (z + 1) * nbPointX + x;
                let index4 = (z + 1) * nbPointX + (x + 1);

                let indexTile = z * nbTileX + x;

                let v1 = points[index1];
                let v2 = points[index2];
                let v3 = points[index3];
                let v4 = points[index4];

                tilts[indexTile] = Math.max(v1, v2, v3, v4) - Math.min(v1, v2, v3, v4);
            }
        }

        return tilts;
    }

    averageByTile(points, nbTileX, nbTileZ, nbPointX) {

        const tiles = new Uint8Array(nbTileX * nbTileZ);

        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index1 = z * nbPointX + x;
                let index2 = z * nbPointX + (x + 1);
                let index3 = (z + 1) * nbPointX + x;
                let index4 = (z + 1) * nbPointX + (x + 1);

                let indexTile = z * nbTileX + x;

                let v1 = points[index1];
                let v2 = points[index2];
                let v3 = points[index3];
                let v4 = points[index4];

                tiles[indexTile] = (v1 + v2 + v3 + v4) / 4;
            }
        }

        return tiles;
    }

    pixelByTile(points, nbTileX, nbTileZ, nbPointX) {
        const tiles = new Uint8Array(nbTileX * nbTileZ);
        for(let x = 0; x < nbTileX; x++) {
            for(let z = 0; z < nbTileZ; z++) {
                let index = (z * nbPointX + x);
                let indexTile = z * nbTileX + x;
                tiles[indexTile] = points[index];
            }
        }
        return tiles;
    }

};
