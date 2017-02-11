class Light {

    constructor(config) {
        this.ambientColor = config.ambient || 0x666666;
        this.directionalColor = 0xffffff;
        this.offsetX = config.offsetX || 70;
        this.offsetY = config.offsetY || -120;
        this.offsetZ = config.offsetZ || -70;
        this.x = 100;
        this.y = 100;
        this.z = 100;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;
        this.zoom = 1|| config.zoom;
        this.shadow = config.shadow || false;
        this.updated = true;
        this._id = 0;
        this.move(config.x || this.x, config.z || this.y, config.z || this.z);
        if(config.targetX || config.targetY || config.targetZ) {
            this.moveTarget(config.targetX, config.targetY, config.targetZ);
        }
        if(config.scale) {
            this.scaleOffset(config.scale);
        }
    }

    move(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetX = this.offsetX + this.x;
        this.targetZ = this.offsetZ + this.x;
        this.updated = true;
    }

    scale(value){
        this.zoom = value;
        this.updated = true;
    }

    moveTarget(x, y, z) {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.x = this.targetX - this.offsetX;
        this.y = this.targetY - this.offsetY;
        this.z = this.targetZ - this.offsetZ;
        this.updated = true;
    }

    scaleOffset(factor) {
        factor = -factor;
        let length = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetX /= length;
        this.offsetY /= length;
        this.offsetZ /= length;
        this.offsetX *= factor;
        this.offsetY *= factor;
        this.offsetZ *= factor;
        this.updated = true;
    }

    dismount() {

    }

}

module.exports = Light;
