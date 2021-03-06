'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Index extends BasePage {
    private menu: Menu;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.menu = new Menu({
            items: [
                {text: 'Играть', page: 'choice', accented: true},
                {text: 'Лидеры', page: 'leaders'},
                {text: 'Об игре', page: 'about'}
            ],
            parent: this._content
        });
    }

    public async render() {
        this._heading.innerHTML = "Многопользовательский пинг-понг";
        this.variableMap.get('userpanel').setOptions(true, false, false);
        this.variableMap.get('userpanel').forceRender();
        this.menu.render();
    }
}
