'use strict';

export class Component {
    protected items: any[];
    protected attrs: any[];
    protected parent: HTMLElement;
    protected template: (data: {}) => string;

    constructor(options) {
        this.items = options.items;
        this.attrs = options.attrs || [];
        this.parent = options.parent;
        this.template = () => '';
    }

    public render() {
        this.parent.innerHTML = this.template({items: this.items, attrs: this.attrs});
        return this;
    }
}
