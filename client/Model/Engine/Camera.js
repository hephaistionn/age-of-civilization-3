class Camera {

    constructor(config) {
        this.x = config.x || 20; //camera position
        this.y = config.y || 24; //camera position
        this.z = config.z || 20; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = config.offsetX || -20;
        this.offsetY = config.offsetY || -24;
        this.offsetZ = config.offsetZ || -20;
        this.move(this.x, this.y, this.z);
        this.pressX = 0;
        this.pressZ = 0;
        this.minX = 0 + this.offsetX;
        this.minZ = 0 + this.offsetZ;
        this.maxX = 0 - this.offsetX;
        this.maxZ = 0 - this.offsetZ;
        this.zoomInit = 1;
        this.moveReady = false;
        this.zoom = config.zoom || 1;
        this.zoomMax = config.zoomMax || 1.5;
        this.zoomMin = config.zoomMin || .7;
        this.updated = false;
        this._id = 1;
        if(config.map)this.setMapBorder(config.map);
    }

    move(x, y, z) {
        this.x = x;
        this.y = z ? y : this.y;
        this.z = z ? z : y;
        this.limiter();
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
        this.updated = true;
    }

    update() {

    }

    dragg(x, z) {
        //Transformation of space. Apply a rotation of PI/4 at  direction vector.
        //screen space to camera spaceè
        if(!this.moveReady) {
            this.initMove(x, z);
        }
        let dx = this.pressX - x;
        let dz = this.pressZ - z;

        let newX = this.iX + dx;
        let newZ = this.iZ + dz;
        this.move(newX, this.y, newZ);
    }

    initMove(x, z) {
        this.moveReady = true;
        this.iX = this.x;
        this.iZ = this.z;
        this.pressX = x;
        this.pressZ = z;
    }

    cleatMove() {
        this.moveReady = false;
        this.zoomInit = this.zoom;
    }

    scale(delta) {
        if(this.zoom < this.zoomMin && delta < 0 || this.zoom > this.zoomMax && delta > 0) return;
        this.zoom = this.zoomInit + delta;
        this.move(x, y, z);
    }

    mouseWheel(delta) {
        if(this.zoom > this.zoomMax && delta < 0 || this.zoom < this.zoomMin && delta > 0) return;
        this.zoom -= delta / 100;
        this.updated = true;
    }

    setMapBorder(dataMap) {
        const margin = 8;
        this.minX = 0 - this.offsetX + margin;
        this.minZ = 0 - this.offsetZ + margin;
        this.maxX = dataMap.nbTileX - this.offsetX - margin;
        this.maxZ = dataMap.nbTileZ - this.offsetZ - margin;
    }

    limiter() {
        this.x = this.x <= this.minX ? this.minX : this.x;
        this.x = this.x >= this.maxX ? this.maxX : this.x;
        this.z = this.z <= this.minZ ? this.minZ : this.z;
        this.z = this.z >= this.maxZ ? this.maxZ : this.z;
    }

    dismount() {

    }
}

module.exports = Camera;
