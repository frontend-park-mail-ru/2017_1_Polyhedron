

class BasePage {
    constructor (template, options) {
        this._options = options;
        this._template = template;
    };

    render() {
        //override this method
    };
}

module.exports = BasePage;