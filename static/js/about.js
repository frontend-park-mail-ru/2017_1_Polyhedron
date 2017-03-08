'use strict';
const BasePage = require('./base');

class About extends BasePage {
    render () {
        window.subheader.innerHTML = "Об игре";
        window.content.innerHTML = window.render_about(this.options);
    };
}

module.exports = About;