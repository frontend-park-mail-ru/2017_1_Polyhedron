'use strict';
const BasePage = require('./base');

class About extends BasePage {
    render () {
        this._heading.innerHTML = "Об игре";
        this._content.innerHTML = this._template(this._options);
    }
}

module.exports = About;
