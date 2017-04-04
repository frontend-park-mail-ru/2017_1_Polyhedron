'use strict';
import {BasePage} from './base';


export class Error extends BasePage {
    render () {
        this._heading.innerHTML = "Ошибка";
        this._content.innerHTML = this._template(this._options);
    }
}
