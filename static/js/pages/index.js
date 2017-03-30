'use strict';

import {BasePage} from './base';


export class Index extends BasePage {
    render () {
        this.renderTop();
        this._heading.innerHTML = "Многопользовательский пинг-понг";
        this._content.innerHTML = this._template(this._options);
    }
}
