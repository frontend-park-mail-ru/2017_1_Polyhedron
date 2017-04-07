
import {BackendAPI} from '../../backend_api';
import {Form} from '../base_form';
import * as fields from '../form_fields';


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
    constructor() {
        let form = document.querySelector(LOGIN_SELECTORS.form);

        let email = form.querySelector(LOGIN_SELECTORS.fields.email);
        let password = form.querySelector(LOGIN_SELECTORS.fields.password);

        let submitter = form.querySelector(LOGIN_SELECTORS.submitter);

        let emailField = new fields.EmailField(email);
        emailField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.email));

        let passwordField = new fields.PasswordField(password);
        passwordField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.password));

        super({
            email: emailField,
            password: passwordField
        }, submitter);
    }

    _sendData() {
        let backendAPI = new BackendAPI();

        backendAPI.login(this._fields.email.getValue(), this._fields.password.getValue())
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                if (responseJson.errors) {
                    console.log(responseJson.errors);
                    alert('Invalid credentials');
                } else {
                    alert('Logged in successfully');
                    window.router.renderAndSave("/");
                }

            })
            .catch(err => {
                alert('Connection failed');
                console.log(err);
            });
    }
}
