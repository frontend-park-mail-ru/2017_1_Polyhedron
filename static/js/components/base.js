'use strict';

export class Component {
    constructor (options) {
        this.items = options.items;
        this.attrs = options.attrs || [];
        this.parent = options.parent;
        this.template = '';
    }

    render () {
        this.parent.innerHTML = this.template({items: this.items, attrs: this.attrs});
        return this;
    }
}
