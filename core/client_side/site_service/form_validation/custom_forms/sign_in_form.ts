
import {BackendAPI} from '../../backend_api';
import {Form} from '../base_form';
import {MESSAGE_MAP} from '../messages';
import * as fields from '../form_fields';
import {Autowired} from "../../../game_mechanics/experimental/decorators";
import {VariableContext} from "../../../game_mechanics/experimental/context";
import {Waiter} from "../../../../../static/js/components/waiter/waiter";
import {Top} from "../../../../../static/js/components/top/top";


const LOGIN_SELECTORS = {
    form: '#signInForm',

    fields: {
        email: '#email',
        password: '#password'
    },

    errors: {
        email: '#error-email',
        password: '#error-password'
    },

    submitter: '#submit'
};

export class SignInForm extends Form {
    @Autowired(BackendAPI)
    private backendAPI: BackendAPI;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor() {
        const form = document.querySelector(LOGIN_SELECTORS.form);

        const email = form.querySelector(LOGIN_SELECTORS.fields.email);
        const password = form.querySelector(LOGIN_SELECTORS.fields.password);

        const submitter = form.querySelector(LOGIN_SELECTORS.submitter);

        const emailField = new fields.EmailField(email);
        emailField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.email));

        const passwordField = new fields.PasswordField(password);
        passwordField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.password));

        super({
            email: emailField,
            password: passwordField
        }, submitter);
    }

    protected _sendData() {
        Top.startLoadingAnimation();
        this.backendAPI.login(this._fields.email.getValue(), this._fields.password.getValue())
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson.errors) {
                    // console.log(responseJson.errors);    // TODO set up proper logging
                    alert(MESSAGE_MAP.INVALID_CREDENTIALS);
                    this.variableMap.set('user', null);
                } else {
                    this.variableMap.set('user', responseJson.data);
                }

                this.variableMap.get('userpanel').forceRender();
                this.variableMap.get('router').renderAndSave('/');

            })
            .catch(err => {
                alert(MESSAGE_MAP.CONNECTION_FAIL);
                this.variableMap.set('user', null);

                this.variableMap.get('userpanel').forceRender();
                this.variableMap.get('router').renderAndSave('/');
                // console.log(err);    // TODO set up proper logging
            });
    }
}
