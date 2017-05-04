'use strict';

import {BasePage} from './base';
import * as renderGame from '../templates/render_game';
import {Gamepad} from '../components/gamepad/gamepad';
import {GameStarter} from '../../../core/client_side/game_mechanics/main/game_start';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Game extends BasePage {
    @Autowired(VariableContext)
    private variableMap: VariableContext;
    private gamepad: Gamepad;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.gamepad = new Gamepad({});
    }

    public async render() {
        try {
            this.reset();
        } catch (err) {
            // TODO add error handling
        }

        this._heading.innerHTML = this._options.multi ? "Сражение" : "Игра";
        this.variableMap.get('userpanel').render();
        this._content.innerHTML = renderGame.template(this._options);
        this.gamepad.render(this._content.querySelector('.game'));

        // TODO uncomment (maybe)
        // window.addEventListener('dblclick', () => {
        //     this._content.style.backgroundColor = 'black';
        //     Game.launchIntoFullscreen(this._content);
        // });
        //
        // window.addEventListener('webkitfullscreenchange', () => {
        //     this._content.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        // });

        //Game.launchIntoFullscreen(this._content); // TODO uncomment (maybe)

        const gameStarter = new GameStarter();
        gameStarter.start('game');
    }

    public reset() {
        this.variableMap.get('loop').stop();
    }
}
