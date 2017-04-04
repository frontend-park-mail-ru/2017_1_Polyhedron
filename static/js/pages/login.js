'use strict';

import {BasePage} from './base';
import {SignInForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_in_form';


export class Login extends BasePage {
    render () {
        this._heading.innerHTML = "Вход в игру";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignInForm();
    }
}
