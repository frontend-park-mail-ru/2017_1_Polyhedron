'use strict';

import {BasePage} from './base';
import * as renderGame from '../templates/render_game';
import {startGame} from '../../../core/client_side/game_mechanics/main/game_start';


export class Game extends BasePage {
    constructor (heading, content, options) {
        super(heading, content, options);
    }

    render () {
        this._heading.innerHTML = "Игра";
        window.userpanel.render();
        this._content.innerHTML = renderGame.template(this._options);
        startGame('game');
    }
}
