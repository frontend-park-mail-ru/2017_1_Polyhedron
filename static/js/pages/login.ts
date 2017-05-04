'use strict';

import {BasePage} from './base';
import {SignInForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_in_form';
import {Form} from '../components/form/form';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Login extends BasePage {
    private form: Form;
    private authorised: Text;
    private _validator: SignInForm;

    @Autowired(VariableContext)
    private variableMap;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
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

    public async render() {
        this._heading.innerHTML = "Вход в игру";
        this.variableMap.get('userpanel').render();

        if (this.variableMap.get('user') !== null) {
            this.authorised.render();
        } else {
            this.form.render();
            this._validator = new SignInForm();
        }
    }
}
