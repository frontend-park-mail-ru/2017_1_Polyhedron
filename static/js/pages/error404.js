'use strict';
import {BasePage} from './base';
import {Text} from '../components/text/text'

export class Error extends BasePage {

    render () {
        this._heading.innerHTML = "Ошибка";
        window.userpanel.render();
        this.text = new Text({
            items: [
                {text: 'Запрашиваемая страница не найдена.'},
                {text: 'Пожалуйста, вернитесь в  меню и попробуйте еще раз!'},
            ],
            parent: this._content
        }).render();
    }
}
