'use strict';
const BasePage = require('./base');

class About extends BasePage {
    render () {
        this.subheader.innerHTML = "Об игре";
        this.content.innerHTML = window.render_about(this.options);
    };
}

module.exports = About;
