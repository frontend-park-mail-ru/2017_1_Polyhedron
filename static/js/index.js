
'use strict';

const BasePage = require('./base');

class Index extends BasePage {
    render () {
        window.subheader.innerHTML = "Многопользовательский пинг-понг";
        window.content.innerHTML = this._template(this._options);
    };
}

module.exports = Index;