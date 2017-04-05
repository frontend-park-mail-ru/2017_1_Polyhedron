'use strict';

import {BasePage} from './base';
import {SignInForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_in_form';
import {Form} from '../components/form/form'


export class Login extends BasePage {
    render () {
        this._heading.innerHTML = "Вход в игру";
        window.userpanel.render();

        this.form = new Form({
            inputs: [
                {name: 'email', text: 'E-mail', type: 'text', placeholder: "Введите e-mail"},
                {name: 'password', text: 'Пароль', type: 'password', placeholder: "Введите пароль"},
            ],
            controls: [
                {name: 'submit', text: 'Войти', type: 'submit'},
                {type: 'link', text: 'Зарегистрироваться', page: 'signup'},
            ],
            parent: this._content
        }).render();
        this._validator = new SignInForm();
    }
}
