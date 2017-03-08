'use strict';

const BasePage = require('./base');

class Login extends BasePage {
    render () {
        this.subheader.innerHTML = "Вход в игру";
        this.content.innerHTML = window.render_login(this.options);
    };
}

module.exports = Login;
