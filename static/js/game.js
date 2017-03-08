'use strict';

const BasePage = require('./base');

class Game extends BasePage {
    render () {
        window.subheader.innerHTML = "Игра";
        window.content.innerHTML = window.render_game(this.options);
    };
}

module.exports = Game;
