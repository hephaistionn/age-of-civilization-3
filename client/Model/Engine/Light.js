class Light {

    constructor(config) {
        this.ambientColor = 0x1111111;
        this.directionalColor = 0xffffff;
        this.offsetX = config.offsetX||60;
        this.offsetY = config.offsetY||-100;
        this.offsetZ = config.offsetZ||0;
        this.x = 100;
        this.y = 100;
        this.z = 100;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;
        this.move(config.x || this.x, config.z||this.y, config.z || this.z);
    }

    move(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetX = this.offsetX + this.x;
        this.targetZ = this.offsetZ + this.x;
    }

    moveTarget(x, y, z) {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.x = this.targetX - this.offsetX;
        this.y = this.targetY - this.offsetY;
        this.z = this.targetZ - this.offsetZ;
    }

    scaleOffset(factor) {
        let length = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetX /= length;
        this.offsetY /= length;
        this.offsetZ /= length;
        this.offsetX *= factor;
        this.offsetY *= factor;
        this.offsetZ *= factor;
    }

    dismount() {

    }

}

module.exports = Light;