'use strict';

const BasePage = require('./base');

class Login extends BasePage {
    render () {
        this._heading.innerHTML = "Вход в игру";
        this._content.innerHTML = this._template(this._options);
    };
}

module.exports = Login;
