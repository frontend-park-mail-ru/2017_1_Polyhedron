'use strict';

import {BasePage} from './base';
import {SignInForm} from '../new_validate';


export class Login extends BasePage {
    render () {
        this._heading.innerHTML = "Вход в игру";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignInForm();
    }
}
