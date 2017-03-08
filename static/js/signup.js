'use strict';

const BasePage = require('./base');

class Signup extends BasePage {
    render () {
        this.subheader.innerHTML = "Регистрация";
        this.content.innerHTML = window.render_signup(this.options);
    };
}

module.exports = Signup;
