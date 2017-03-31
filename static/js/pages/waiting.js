'use strict';

import {BasePage} from './base';


export class Waiting extends BasePage {
    render () {
        this._heading.innerHTML = "Подготовка партии";
        this._content.innerHTML = this._template(this._options);
    }
}
