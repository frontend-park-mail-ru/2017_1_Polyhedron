'use strict';

import * as renderGamepad from '../../templates/render_gamepad';

export class Gamepad {
    private template: (options: {}) => string;
    public cotrolLeft;
    public controlUp;
    public controlRight;
    public controlDown;
    private element;

    constructor(options) {
        this.template = renderGamepad.template;
    }

    public render(parent): void {
        parent.innerHTML = parent.innerHTML + this.template({});
        this.element = parent.querySelector('.controls');
        this.cotrolLeft = this.element.children[0];
        this.controlUp = this.element.children[1];
        this.controlDown = this.element.children[2];
        this.controlRight = this.element.children[3];

    }
}
