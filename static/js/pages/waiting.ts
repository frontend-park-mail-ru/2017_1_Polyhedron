'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Waiting extends BasePage {
    private text: Text;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.text = new Text({
            items: [
                {text: 'Пожалуйста, подождите'},
                {text: 'Идёт подбор противников'}
            ],
            parent: this._content
        });
    }

    public async render() {
        this._heading.innerHTML = "Подготовка партии";
        this.variableMap.get('userpanel').render();
        this.text.render();
    }
}
