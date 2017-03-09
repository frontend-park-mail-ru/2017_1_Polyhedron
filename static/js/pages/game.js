'use strict';

const BasePage = require('./base');
const createGame = require('../../../core/game_start');
createGame('game');

class Game extends BasePage {
    render () {
        this._heading.innerHTML = "Игра";
        this._content.innerHTML = this._template(this._options);
    }
}

module.exports = Game;
