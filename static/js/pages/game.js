'use strict';

import {BasePage} from './base';
import * as renderGame from '../templates/render_game';
import {startGame} from '../../../core/client_side/game_mechanics/main/game_start';


export class Game extends BasePage {
    render () {
        this._heading.innerHTML = "Игра";
        window.userpanel.render();
        this._content.innerHTML = renderGame.template(this._options);
        startGame('game');
    }
}
