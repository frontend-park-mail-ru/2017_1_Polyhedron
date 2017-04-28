'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableMap} from "../../../core/client_side/game_mechanics/experimental/context";


export class Index extends BasePage {
    private menu: Menu;

    @Autowired(VariableMap)
    private variableMap: VariableMap;

    constructor(heading, content, options?) {
        super(heading, content, options);
        this.menu = new Menu({
            items: [
                {text: 'Играть', page: 'choice', accented: true},
                {text: 'Лидеры', page: 'leaders'},
                {text: 'Об игре', page: 'about'}
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Многопользовательский пинг-понг";
        this.variableMap.getVariable('userpanel').render();
        this.menu.render();
    }
}
