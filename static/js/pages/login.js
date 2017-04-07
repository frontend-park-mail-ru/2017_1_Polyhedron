'use strict';

import {BasePage} from './base';
import {SignInForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_in_form';
import {Form} from '../components/form/form';
import {Text} from '../components/text/text';


export class Login extends BasePage {
    constructor (heading, content, options) {
        super(heading, content, options);
        this.form = new Form({
            name: 'signInForm',
            inputs: [
                {name: 'email', text: 'E-mail', type: 'text', placeholder: "Введите e-mail"},
                {name: 'password', text: 'Пароль', type: 'password', placeholder: "Введите пароль"},
            ],
            controls: [
                {name: 'submit', text: 'Войти', type: 'submit'},
                {type: 'link', text: 'Зарегистрироваться', page: 'signup'},
            ],
            parent: this._content
        });
        this.authorised = new Text({
            items: [
                {text: 'Вы уже залогинены.'},
            ],
            parent: this._content
        });
    }

    render () {
        this._heading.innerHTML = "Вход в игру";
        window.userpanel.render();

        if (window.user !== null) {
            this.authorised.render();
        }
        else {
            this.form.render();
            this._validator = new SignInForm();
        }
    }
}
