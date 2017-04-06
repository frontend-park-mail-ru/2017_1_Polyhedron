'use strict';
import {BasePage} from './base';
import {Text} from '../components/text/text'

export class Error extends BasePage {
    constructor (heading, content, options) {
        super(heading, content, options);
        this.text = new Text({
            items: [
                {text: 'Запрашиваемая страница не найдена.'},
                {text: 'Пожалуйста, вернитесь в  меню и попробуйте еще раз!'},
            ],
            parent: this._content
        });
    }

    render () {
        this._heading.innerHTML = "Ошибка";
        window.userpanel.render();
        this.text.render();
    }
}
