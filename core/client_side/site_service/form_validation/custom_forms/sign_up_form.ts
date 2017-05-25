
import {BackendAPI} from '../../backend_api';
import {Form} from '../base_form';
import {MESSAGE_MAP} from '../messages';
import * as fields from '../form_fields';
import {Autowired} from "../../../game_mechanics/experimental/decorators";
import {VariableContext} from "../../../game_mechanics/experimental/context";
import {Top} from "../../../../../static/js/components/top/top";


const REGISTER_SELECTORS = {
    form: '#signUpForm',

    fields: {
        login: '#login',
        email: '#email',
        password: '#password',
        passwordRepeat: '#password2',
    },

    errors: {
        email: '#error-email',
        password: '#error-password',
        login: '#error-login',
        passwordRepeat: '#error-password2',
    },

    submitter: '#submit'
};


export class SignUpForm extends Form {
    @Autowired(BackendAPI)
    private backendAPI: BackendAPI;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor() {
        const form = document.querySelector(REGISTER_SELECTORS.form);

        const email = form.querySelector(REGISTER_SELECTORS.fields.email);
        const login = form.querySelector(REGISTER_SELECTORS.fields.login);
        const password = form.querySelector(REGISTER_SELECTORS.fields.password);
        const passwordRepeat = form.querySelector(REGISTER_SELECTORS.fields.passwordRepeat);

        const submitter = form.querySelector(REGISTER_SELECTORS.submitter);

        const emailField = new fields.EmailField(email);
        emailField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.email));

        const loginField = new fields.LoginField(login);
        loginField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.login));

        const passwordField = new fields.PasswordField(password);
        passwordField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.password));

        const passwordRepeatField = new fields.PasswordRepeatField(passwordRepeat, {
            referenceField: password
        });
        passwordRepeatField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.passwordRepeat));

        super({
            email: emailField,
            login: loginField,
            password: passwordField,
            passwordRepeat: passwordRepeatField,
        }, submitter);
    }

    protected _sendData() {
        Top.startLoadingAnimation();

        this.backendAPI.register(
            this._fields.email.getValue(),
            this._fields.login.getValue(),
            this._fields.password.getValue()
        )
            .then(response => {
                if (response.status === 200) {
                    this._alert.innerHTML = MESSAGE_MAP.SIGN_UP_SUCCESS;
                    this.variableMap.get('router').render("/");
                } else {
                    this._alert.innerHTML = MESSAGE_MAP.SIGN_UP_FAIL;
                }
                // console.log(response);   // TODO set up proper logging
            })
            .catch(err => {
                this._alert.innerHTML = MESSAGE_MAP.CONNECTION_FAIL;
                // console.log(err);    // TODO set up proper logging
            });
    }
}
