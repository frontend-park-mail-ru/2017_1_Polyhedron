'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class ChoiceGameMode extends BasePage {
    private menu: Menu;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.menu = new Menu({
            items: [
                {text: 'Одиночная игра', page: 'game', accented: true},
                {text: 'Сетевая игра', page: 'waiting'}
            ],
            parent: this._content
        });
    }

    public async render() {
        this._heading.innerHTML = "Выбор режима";
        this.variableMap.get('userpanel').set_options(false, false, false);
        this.variableMap.get('userpanel').forceRender();
        this.menu.render();
    }
}
