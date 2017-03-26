'use strict';

import {BasePage} from './base';

export class Choice extends BasePage {
    render () {
        this._heading.innerHTML = "Выбор режима";
        this._content.innerHTML = this._template(this._options);
    }
}
