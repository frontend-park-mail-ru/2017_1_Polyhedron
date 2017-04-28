'use strict';

import {BasePage} from './base';
import * as renderGame from '../templates/render_game';
import {startGame} from '../../../core/client_side/game_mechanics/main/game_start';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableMap} from "../../../core/client_side/game_mechanics/experimental/context";


export class Game extends BasePage {
    @Autowired(VariableMap)
    private variableMap: VariableMap;

    constructor(heading, content, options?) {
        super(heading, content, options);
    }

    public render() {
        this._heading.innerHTML = "Игра";
        this.variableMap.getVariable('userpanel').render();
        this._content.innerHTML = renderGame.template(this._options);
        startGame('game');
    }

    public reset() {
        (window as any).loop.stop(); // TODO put loop somewhere
    }
}
