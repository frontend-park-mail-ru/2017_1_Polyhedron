'use strict';

const BasePage = require('./base');
//const SignInForm = require('../validate').SignInForm;
const SignInForm = require('../new_validate').SignInForm;

class Login extends BasePage {
    render () {
        this._heading.innerHTML = "Вход в игру";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignInForm();
    }
}

module.exports = Login;
