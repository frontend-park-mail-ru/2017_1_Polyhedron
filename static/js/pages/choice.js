'use strict';

import {BasePage} from './base';
import {Menu} from '../components/menu/menu'


export class Choice extends BasePage {
    render () {
        this._heading.innerHTML = "Выбор режима";
        window.userpanel.render();
        this.menu = new Menu({
            items: [
                {text: 'Одиночная игра', page: 'game', accented: true},
                {text: 'Сетевая игра', page: 'waiting'}
            ],
            parent: this._content
        }).render();
    }
}
