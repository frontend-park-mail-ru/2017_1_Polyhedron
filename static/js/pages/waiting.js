'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text'


export class Waiting extends BasePage {
    render () {
        this._heading.innerHTML = "Подготовка партии";
        window.userpanel.render();
        this.text = new Text({
            items: [
                {text: 'Пожалуйста, подождите'},
                {text: 'Идёт подбор противников'}
            ],
            parent: this._content
        }).render();
    }
}
