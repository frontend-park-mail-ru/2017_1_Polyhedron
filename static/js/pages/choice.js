'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu';


export class ChoiceGameMode extends BasePage {
    constructor (heading, content, options) {
        super(heading, content, options);
        this.menu = new Menu({
            items: [
                {text: 'Одиночная игра', page: 'game', accented: true},
                {text: 'Сетевая игра', page: 'waiting'}
            ],
            parent: this._content
        });
    }

    render () {
        this._heading.innerHTML = "Выбор режима";
        window.userpanel.render();
        this.menu.render();
    }
}
