'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


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

    public render() {
        this._heading.innerHTML = "Партия завершена";
        this.variableMap.get('userpanel').set_options(false, false, false);
        this.variableMap.get('userpanel').render();
        this.winnerText.render();
    }
}
