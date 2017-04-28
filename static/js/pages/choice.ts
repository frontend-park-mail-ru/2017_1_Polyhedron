'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableMap} from "../../../core/client_side/game_mechanics/experimental/context";


export class ChoiceGameMode extends BasePage {
    private menu: Menu;

    @Autowired(VariableMap)
    private variableMap: VariableMap;

    constructor(heading, content, options?) {
        super(heading, content, options);
        this.menu = new Menu({
            items: [
                {text: 'Одиночная игра', page: 'game', accented: true},
                {text: 'Сетевая игра', page: 'waiting'}
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Выбор режима";
        this.variableMap.getVariable('userpanel').render();
        this.menu.render();
    }
}
