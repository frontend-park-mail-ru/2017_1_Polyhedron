'use strict';

export abstract class BasePage {
    // TODO specify more concrete types
    protected _heading: any;
    protected _content: any;
    protected _options: any;

    constructor(heading, container, options?) {
        this._heading = heading;
        this._content = container;
        this._options = options;
    }

    public abstract render();

    public reset() {
        // this method rarely must be overrided.
        // In most cases you need it to be empty.
    }
}
