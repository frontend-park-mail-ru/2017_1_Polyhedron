'use strict';

const BasePage = require('./base');

class Index extends BasePage {
    render () {
        this._heading.innerHTML = "Многопользовательский пинг-понг";
        this._content.innerHTML = this._template(this._options);
    }
}

module.exports = Index;
