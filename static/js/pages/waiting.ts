'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableMap} from "../../../core/client_side/game_mechanics/experimental/context";


export class Waiting extends BasePage {
    private text: Text;

    @Autowired(VariableMap)
    private variableMap: VariableMap;

    constructor(heading, content, options?) {
        super(heading, content, options);
        this.text = new Text({
            items: [
                {text: 'Пожалуйста, подождите'},
                {text: 'Идёт подбор противников'}
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Подготовка партии";
        this.variableMap.getVariable('userpanel').render();
        this.text.render();
    }
}
