
'use strict';

const BasePage = require('./base');

class Login extends BasePage {
    render () {
        window.subheader.innerHTML = "Вход в игру";
        window.content.innerHTML = window.render_login(this.options);
    };
}

module.exports = Login;
