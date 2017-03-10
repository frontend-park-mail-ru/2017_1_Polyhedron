'use strict';

const BasePage = require('./base');
const SignUpForm = require('../validate').SignUpForm;

class Signup extends BasePage {
    render () {
        this._heading.innerHTML = "Регистрация";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignUpForm(document.getElementById("signUpForm"));
    }
}

module.exports = Signup;
