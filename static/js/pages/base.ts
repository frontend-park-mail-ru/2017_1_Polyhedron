'use strict';

export abstract class BasePage {
    // TODO specify more concrete types
    protected _heading: any;
    protected _content: any;
    protected _alert: any;
    protected _options: any;

    constructor(heading, container, alert, options?) {
        this._heading = heading;
        this._content = container;
        this._alert = alert;
        this._options = options;
    }

    public abstract async render(options?: {});

    public reset() {
        // this method rarely must be overrided.
        // In most cases you need it to be empty.
    }
}
