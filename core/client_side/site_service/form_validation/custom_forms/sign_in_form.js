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
class SignInForm extends base_form_1.Form {
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
    _sendData() {
        this.backendAPI.login(this._fields.email.getValue(), this._fields.password.getValue())
            .then(response => {
            return response.json();
        })
            .then(responseJson => {
            if (responseJson.errors) {
                // console.log(responseJson.errors);    // TODO set up proper logging

                alert(messages_1.MESSAGE_MAP.INVALID_CREDENTIALS);
            }
            else {
                alert(messages_1.MESSAGE_MAP.LOGIN_SUCCESS);
                this.variableMap.get('router').renderAndSave('/');
            }
        })
            .catch(err => {
            alert(messages_1.MESSAGE_MAP.CONNECTION_FAIL);
            // console.log(err);    // TODO set up proper logging
        });
    }
}
__decorate([
    decorators_1.Autowired(backend_api_1.BackendAPI)
], SignInForm.prototype, "backendAPI", void 0);
__decorate([
    decorators_1.Autowired(context_1.VariableContext)
], SignInForm.prototype, "variableMap", void 0);
exports.SignInForm = SignInForm;
//# sourceMappingURL=sign_in_form.js.map