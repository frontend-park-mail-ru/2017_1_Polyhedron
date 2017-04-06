'use strict';

export class BasePage {
    constructor (heading, container, options) {
        this._heading = heading;
        this._content = container;
        this._options = options;
    }

    render() {
        //override this method
    }

    reset () {}
}
