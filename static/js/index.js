'use strict';

const BasePage = require('./base');

class Index extends BasePage {
    render () {
        this.subheader.innerHTML = "Многопользовательский пинг-понг";
        this.content.innerHTML = window.render_index(this.options);
    };
}

module.exports = Index;
