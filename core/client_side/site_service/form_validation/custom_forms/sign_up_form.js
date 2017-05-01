"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const backend_api_1 = require("../../backend_api");
const base_form_1 = require("../base_form");
const messages_1 = require("../messages");
const fields = require("../form_fields");
const decorators_1 = require("../../../game_mechanics/experimental/decorators");
const context_1 = require("../../../game_mechanics/experimental/context");
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
class SignUpForm extends base_form_1.Form {
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
    _sendData() {
        this.backendAPI.register(this._fields.email.getValue(), this._fields.login.getValue(), this._fields.password.getValue())
            .then(response => {
            if (response.status === 200) {
                alert(messages_1.MESSAGE_MAP.SIGN_UP_SUCCESS);
                this.variableMap.get('router').render("/");
            }
            else {
                alert(messages_1.MESSAGE_MAP.SIGN_UP_FAIL);
            }
            // console.log(response);   // TODO set up proper logging
        })
            .catch(err => {
            alert(messages_1.MESSAGE_MAP.CONNECTION_FAIL);
            // console.log(err);    // TODO set up proper logging
        });
    }
}
__decorate([
    decorators_1.Autowired(backend_api_1.BackendAPI)
], SignUpForm.prototype, "backendAPI", void 0);
__decorate([
    decorators_1.Autowired(context_1.VariableContext)
], SignUpForm.prototype, "variableMap", void 0);
exports.SignUpForm = SignUpForm;
//# sourceMappingURL=sign_up_form.js.map