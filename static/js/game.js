
'use strict';

const BasePage = require('./base');

class Game extends BasePage {
    render () {
        window.subheader.innerHTML = "Игра";
        window.content.innerHTML = this._template(this._options);
    };
}

module.exports = Game;