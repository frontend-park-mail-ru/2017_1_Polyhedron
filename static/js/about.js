'use strict';
const BasePage = require('./base');

class About extends BasePage {
    render () {
        window.subheader.innerHTML = "Об игре";
        window.content.innerHTML = this._template(this._options);
    };
}

module.exports = About;