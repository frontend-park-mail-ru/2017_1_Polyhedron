'use strict';

import * as renderForm from '../../templates/render_form';

export class Form {
    private name: string;
    private inputs: HTMLInputElement[];
    private controls: HTMLElement[];
    private parent: HTMLElement;
    private template: (options: {}) => string;

    constructor(options) {
        this.name = options.name;
        this.inputs = options.inputs;
        this.controls = options.controls;
        this.parent = options.parent;
        this.template = renderForm.template;
    }

    public render(): void {
        this.parent.innerHTML = this.template({name: this.name, inputs: this.inputs, controls: this.controls});
    }
}
