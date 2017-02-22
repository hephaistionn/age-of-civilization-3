const THREE = require('three');

module.exports.followPath = function followPath(Component) {

    Component.prototype.followPath = function followPath(dt) {

        if(!this.shape.length) return;
        this.moveProgress += dt * this.moveSpeed;

        this.moveProgress = Math.min(this.shape.length, this.moveProgress);
        let point = this.shape.getPointAndTangent(this.moveProgress);

        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = point[0];
        matrixWorld[13] = point[1];
        matrixWorld[14] = point[2];

        const a = Math.atan2(point[4], point[3]);

        matrixWorld[0] = Math.cos(a);
        matrixWorld[2] = Math.sin(a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    };

    Component.prototype.moveProgress = 0;
    Component.prototype.moveSpeed = 400;
};

module.exports.playAnimation = function playAnimation(Component) {

    Component.prototype.playAnimation = function playAnimation(dt) {
        let mesh;

        if(this.element.morphTargetInfluences) {
            mesh = this.element;
        } else if(this.element.children[0] && this.element.children[0].morphTargetInfluences) {
            mesh = this.element.children[0];
        } else if(this.element.children[1] && this.element.children[1].morphTargetInfluences) {
            mesh = this.element.children[1];
        } else {
            return;
        }

        const animation = this.animations[this.currentAnimation];
        const steps = animation.steps;
        const duration = animation.duration;
        const nbSteps = steps.length - 1;
        const nbTarget = mesh.morphTargetInfluences.length;

        this.animProgress += dt / duration;
        if(this.animProgress > 1) {
            this.animProgress = Math.min(this.animProgress, 1) - 1;
        }

        const indexStep = Math.min(Math.floor(this.animProgress * nbSteps), nbSteps - 1);

        for(let i = 0; i < nbTarget; i++) {
            mesh.morphTargetInfluences[i] = 0
        }

        const ia = steps[indexStep];
        const ib = steps[indexStep + 1];
        mesh.morphTargetInfluences[ib] = this.animProgress / (1 / nbSteps) - indexStep;
        mesh.morphTargetInfluences[ia] = 1 - mesh.morphTargetInfluences[ib];

    };

    Component.prototype.animProgress = 0;
};


module.exports.replaceMesh = function replaceMesh(Component) {

    Component.prototype.previousGeo = null;

    Component.prototype.replaceMesh = function replaceMesh(path, material, model) {
        if(path === this.previousGeo) return;

        this.previousGeo = path;

        for(let i = 0; i < this.element.children.length; i++) {
            if(this.element.children[i].name === model._id) {
                this.element.remove(this.element.children[i]);
            }
        }
        const mesh = THREE.getMesh(path, material, model._id);
        this.element.add(mesh)
    };

};
