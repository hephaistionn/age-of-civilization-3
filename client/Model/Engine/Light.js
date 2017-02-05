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

var t = {
    "id": "city_355dbfd5c",
    "name": "Uruk",
    "leader": "leader_84ecf0707",
    "level": 1,
    "type": "EntityCity",
    "completed": false,
    "mapId": "test",
    "states": {"population": 8, "workers": 0, "explorers": 0, "wood": 160, "stone": 100, "meat": 100},
    "trade": {"wood": 0, "stone": 0, "meat": 0},
    "x": 10,
    "y": 0.33725490196078434,
    "z": 28,
    "camera": {"x": 27.5, "z": 27.5, "zoom": 1.3},
    "goal": {"population": 10, "meat": 100},
    "entities": {
        "EntityHouse": [{"x": 1.5, "y": 0.17254901960784313, "z": 10.5, "a": 0}, {
            "x": 2.5,
            "y": 0.17254901960784313,
            "z": 8.5,
            "a": 0
        }]
    }
}
