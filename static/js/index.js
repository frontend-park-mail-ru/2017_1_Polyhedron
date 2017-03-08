
'use strict';

const BasePage = require('./base');

class Index extends BasePage {
    render () {
        window.subheader.innerHTML = "Многопользовательский пинг-понг";
        window.content.innerHTML = window.render_index(this.options);
    };
}

module.exports = Index;