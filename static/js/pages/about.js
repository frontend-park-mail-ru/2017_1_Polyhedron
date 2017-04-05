'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text'


export class About extends BasePage {
    render () {
        this._heading.innerHTML = "Об игре";
        window.userpanel.render();
        this.text = new Text({
            items: [
                {text: 'Наша игра - сетевой пинг-понг для трёх пользователей.'},
                {text: 'Мы используем JavaScript + Java.'},
                {text: 'Проект является семестровым заданием нашей команды из&nbsp;' +
                '<a href="http://park.mail.ru"> Технопарка@mail.ru</a>.'},
            ],
            parent: this._content
        }).render();
    }
}
