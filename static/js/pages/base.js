'use strict';

export class BasePage {
    constructor (heading, container, options) {
        this._heading = heading;
        this._content = container;
        this._options = options;
    }

    render() {
        throw new Error('Override render method or the BasePage class');
    }

    reset () {
        // this method rarely must be overrided.
        // In most cases you need it to be empty.
    }
}
