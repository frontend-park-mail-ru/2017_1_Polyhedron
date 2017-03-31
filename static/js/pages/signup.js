'use strict';

import {BasePage} from './base';
import {SignUpForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_up_form';


export class Signup extends BasePage {
    render () {
        this._heading.innerHTML = "Регистрация";
        this._content.innerHTML = this._template(this._options);
        this._validator = new SignUpForm();
    }
}
