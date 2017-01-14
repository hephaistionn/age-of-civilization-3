class Camera {

    constructor(config) {
        this.x = config.x || 0; //camera position
        this.y = config.y || 96; //camera position
        this.z = config.z || 0; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = config.offsetX || -80; //target positio relative too camera position
        this.offsetY = config.offsetY || -96; //target position relative to camera position
        this.offsetZ = config.offsetZ || -80; //target position relative to camera position
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
        this.pressX = 0;
        this.pressZ = 0;
        this.moveSpeed = 0.01;
        this.maxXTarget = 0;
        this.maxZTarget = 0;
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
        this.zoom = 1;
        this.zoomInit = 1;
        this.moveReady = false;
        this.zoom = 1;
        this.zoomMax = config.zoomMax || 3;
        this.zoomMin = config.zoomMin || .5;
        this.updated = false;
    }

    move(x, y, z) {
        this.x = x;
        this.z = z;
        this.y = y;
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
        if(this.zoom < this.zoomMin && delta < 0 || this.zoom > this.zoomMax && delta > 0) return;
        this.zoom += delta/100;
        this.updated = true;
    }

    setMapBorder(dataMap) {
        this.maxXTarget = dataMap.nbTileX;
        this.maxZTarget = dataMap.nbTileZ;
        this.computeBorder();
    }

    computeBorder() {
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
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
