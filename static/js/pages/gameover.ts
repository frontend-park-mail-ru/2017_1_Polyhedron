'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";
import {router} from "./main";


export class GameOver extends BasePage {
    private winnerText: Text;
    private loserText: Text;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.winnerText = new Text({
            items: [
                {text: 'Вы победили!'},
                {text: '<a href="/choice">Еще партию?</a>'},
            ],
            parent: this._content
        });
        this.loserText = new Text({
            items: [
                {text: 'К сожалению, Вы проиграли.'},
                {text: '<a href="/choice">Отыграемся?</a>'},
            ],
            parent: this._content
        });
    }

    public async render(options) {
        this._heading.innerHTML = "Партия завершена";
        this.variableMap.get('userpanel').set_options(false, false, false);
        this.variableMap.get('userpanel').forceRender();

        if (!options) {
            throw new Error('Tried to render gameover page without options');
        }

        if (options.isWinner) {
            this.winnerText.render();
        } else {
            this.loserText.render();
        }
    }
}
