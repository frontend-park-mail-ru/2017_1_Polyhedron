'use strict';

import {BasePage} from './base';
import * as renderGame from '../templates/render_game';
import {GameStarter} from '../../../core/client_side/game_mechanics/main/game_start';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Game extends BasePage {
    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, options?) {
        super(heading, content, options);
    }

    public render() {
        this._heading.innerHTML = "Игра";
        this.variableMap.get('userpanel').render();
        this._content.innerHTML = renderGame.template(this._options);

        const gameStarter = new GameStarter();
        gameStarter.start('game');
    }

    public reset() {
        this.variableMap.get('loop').stop();
    }
}
