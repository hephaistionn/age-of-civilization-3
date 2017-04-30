const ee = require('../../services/eventEmitter');

class EditorPanel {

    constructor() {
        this.displayed = false;
        this.entityEditor = false;
        this.roadeEditor = false;
        this.eraseEditor = false;
        this.position = {
            x: 50,
            y: 50
        };
        this.updated = false;
        this._id = 0;
    }

    open() {
        this.displayed = true;
        this.updated = true;
    }

    showEntityEditor() {
        this.entityEditor = true;
        this.updated = true;
    }

    showDeletionEditor() {
        this.eraseEditor = true;
        this.updated = true;
    }

    showRoadeEditor() {
        this.roadeEditor = true;
        this.updated = true;
    }

    onConfirm(fct) {
        this._onConfirm = () => {
            this._hide();
            fct();
        };
    }

    onRotate(fct) {
        this._onRotate = fct;
    }

    onCancel(fct) {
        this._onCancel = () => {
            this._hide();
            fct();
        };
    }

    move(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.updated = true;
    }

    _hide() {
        this.displayed = false;
        this.entityEditor = false;
        this.roadeEditor = false;
        this.eraseEditor = false;
        this.updated = true;
    }


}

EditorPanel.ui = true;
module.exports = EditorPanel;