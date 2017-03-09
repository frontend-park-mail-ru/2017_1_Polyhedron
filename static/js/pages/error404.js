'use strict';
const BasePage = require('./base');

class Error extends BasePage {
    render () {
        this._heading.innerHTML = "Ошибка";
        this._content.innerHTML = this._template(this._options);
    }
}

module.exports = Error;
