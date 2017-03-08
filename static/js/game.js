'use strict';

const BasePage = require('./base');

class Game extends BasePage {
    render () {
        this.subheader.innerHTML = "Игра";
        this.content.innerHTML = window.render_game(this.options);
    };
}

module.exports = Game;
