
'use strict';

const BasePage = require('./base');

class Signup extends BasePage {
    render () {
        window.subheader.innerHTML = "Регистрация";
        window.content.innerHTML = window.render_signup(this._options);
    };
}

module.exports = Signup;