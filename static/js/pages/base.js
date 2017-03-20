
export class BasePage {
    constructor (heading, container, template, options) {
        this._heading = heading;
        this._content = container;
        this._options = options;
        this._template = template;
    }

    render() {
        //override this method
    }
}
