'use strict';
import {BasePage} from './base';


export class About extends BasePage {
    render () {
        this._heading.innerHTML = "Об игре";
        this._content.innerHTML = this._template(this._options);
    }
}
