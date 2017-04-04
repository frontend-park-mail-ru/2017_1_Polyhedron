'use strict';

import {BasePage} from './base';
import {startGame} from '../../../core/client_side/game_mechanics/main/game_start';


export class Game extends BasePage {
    render () {
        this._heading.innerHTML = "Игра";
        this._content.innerHTML = this._template(this._options);
        startGame('game');
    }
}
