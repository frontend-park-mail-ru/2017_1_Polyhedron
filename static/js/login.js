'use strict';

const BasePage = require('./base');

class Login extends BasePage {
    render () {
        window.subheader.innerHTML = "Вход в игру";
        window.content.innerHTML = this._template(this._options);
    };
}

module.exports = Login;
