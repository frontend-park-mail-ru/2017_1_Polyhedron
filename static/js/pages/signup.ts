'use strict';

import {BasePage} from './base';
import {SignUpForm} from '../../../core/client_side/site_service/form_validation/custom_forms/sign_up_form';
import {Form} from '../components/form/form';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class Signup extends BasePage {
    private form: Form;
    private authorised: Text;
    private _validator: SignUpForm;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.form = new Form({
            name: 'signUpForm',
            inputs: [
                {name: 'login', text: 'Логин', type: 'text', placeholder: "Введите логин"},
                {name: 'password', text: 'Пароль', type: 'password', placeholder: "Введите пароль"},
                {name: 'password2', text: 'Ещё раз пароль', type: 'password', placeholder: "Повторите пароль"},
                {name: 'email', text: 'E-mail', type: 'text', placeholder: "example@example.com"},
            ],
            controls: [
                {name: 'submit', text: 'Зарегистрироваться', type: 'submit'},
                {type: 'link', text: 'Войти', page: 'login'},
            ],
            parent: this._content
        });

        this.authorised = new Text({
            items: [
                {text: 'Вы уже зарегистрированы.'},
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Регистрация";
        this.variableMap.get('userpanel').render();
        if (this.variableMap.get('user') !== null) {
            this.authorised.render();
        } else {
            this.form.render();
            this._validator = new SignUpForm();
        }
    }
}
