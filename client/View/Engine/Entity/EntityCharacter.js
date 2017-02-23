const Shape = require('../../../services/shape');
const config = require('../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;


class EntityCharacter {

    constructor(model, parent) {
        this.model = model;
        this.element = null;
        this.animations = null;
        this.currentAnimation = 'walk';
        this.currentAnimationChild = null;
        if(model.path) {
            this.shape = new Shape(model.path, tileSize, tileHeight);
            this.walk = true;
        } else {
            this.shape = null;
            this.walk = false;
        }
        this.moveSpeed = model._speed * tileSize;
        this.moveProgress = model.timer * this.moveSpeed;
        this.initMesh(model);
        for(let i = 0, l = this.element.children.length; i < l; i++) {
            this.element.children[i].matrixWorld = this.element.matrixWorld;
        }
        this.updateState(model, true);
        this.add(parent);
    }

    update(dt) {
        if(this.walk) this.followPath(dt);
        if(this.currentAnimation) this.playAnimation(dt);
        if(this.currentAnimationChild) this.playAnimationChild(dt);
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = (this.model.x) * tileSize;
        matrixWorld[14] = (this.model.z) * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
        matrixWorld[0] = Math.cos(this.model.a);
        matrixWorld[2] = Math.sin(this.model.a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    }

    playAnimation(dt) {
        if(!this.element.morphTargetInfluences) return;
        const animation = this.animations[this.currentAnimation];
        const steps = animation.steps;
        const duration = animation.duration;
        const nbSteps = steps.length - 1;
        const nbTarget = this.element.morphTargetInfluences.length;
        this.element.animProgress += dt / duration;
        if(this.element.animProgress > 1) {
            this.element.animProgress = Math.min(this.element.animProgress, 1) - 1;
        }
        const indexStep = Math.min(Math.floor(this.element.animProgress * nbSteps), nbSteps - 1);
        for(let i = 0; i < nbTarget; i++) {
            this.element.morphTargetInfluences[i] = 0
        }
        const ia = steps[indexStep];
        const ib = steps[indexStep + 1];
        this.element.morphTargetInfluences[ib] = this.element.animProgress / (1 / nbSteps) - indexStep;
        this.element.morphTargetInfluences[ia] = 1 - this.element.morphTargetInfluences[ib];
    }


    playAnimationChild(dt) {
        const mesh = this.element.children[0];
        if(!mesh.morphTargetInfluences) return;
        const animation = this.animations[this.currentAnimationChild];
        const steps = animation.steps;
        const duration = animation.duration;
        const nbSteps = steps.length - 1;
        const nbTarget = mesh.morphTargetInfluences.length;
        mesh.animProgress += dt / duration;
        if(mesh.animProgress > 1) {
            mesh.animProgress = Math.min(mesh.animProgress, 1) - 1;
        }
        const indexStep = Math.min(Math.floor(mesh.animProgress * nbSteps), nbSteps - 1);
        for(let i = 0; i < nbTarget; i++) {
            mesh.morphTargetInfluences[i] = 0
        }
        const ia = steps[indexStep];
        const ib = steps[indexStep + 1];
        mesh.morphTargetInfluences[ib] = mesh.animProgress / (1 / nbSteps) - indexStep;
        mesh.morphTargetInfluences[ia] = 1 - mesh.morphTargetInfluences[ib];
    }


    followPath(dt) {

        if(!this.shape || !this.shape.length) return;
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
    }

    remove(parent) {
        parent.render.scene.remove(this.element);
    }

    add(parent) {
        if(parent)
            parent.render.scene.add(this.element);
    }
}


module.exports = EntityCharacter;
