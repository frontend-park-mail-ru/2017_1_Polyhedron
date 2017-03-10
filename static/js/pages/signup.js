'use strict';

const BasePage = require('./base');
const SignUpForm = require('../new_validate').SignUpForm;

class Signup extends BasePage {
    render () {
        this._heading.innerHTML = "Регистрация";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignUpForm();
    }
}

module.exports = Signup;
