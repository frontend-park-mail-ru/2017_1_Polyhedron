
import {BackendAPI} from './backend_api';


const DEFAULT_PARAMETERS = {
    email: {
        minLength: 2,
        maxLength: 100,
        pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },

    login: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i,
    },

    password: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i,
    }
};


const DEFAULT_TEXT_MESSAGES = {
    short: 'Too short',
    long: 'Too long',
    incorrect: 'Incorrect value',
    match: 'Not match'
};


class Field {
    constructor(DOMElement, options) {
        this._DOMElement = DOMElement;
        this._options = options || {};
        this._errorOutput = null;
    }

    getErrors() {
        throw 'override this method';
    }

    isValid() {
        return this.getErrors().length === 0;
    }

    setErrorOutput(DOMElement) {
        this._errorOutput = DOMElement;
        this._DOMElement.addEventListener('change', () => {

            this._errorOutput.innerHTML = this.getErrors().join('<br>').toString();
        });
    }

    setChangeCallBack(callback) {
        this._DOMElement.addEventListener('change', callback);
    }
}


class TextField extends Field {
    constructor(DOMElement, options, messages) {
        super(DOMElement, options);
        this._maxLength = this._options['maxLength'];
        this._minLength = this._options['minLength'];
        this._pattern = this._options['pattern'];

        this._messages = messages;
    }

    getValue() {
        return this._DOMElement.value;
    }

    getErrors() {
        const fieldValue = this._DOMElement.value;

        let errors = [];
        if (fieldValue.length < this._minLength) {
            errors.push(this._messages.short);
        }
        if (fieldValue.length > this._maxLength) {
            errors.push(this._messages.long);
        }
        if (!fieldValue.match(this._pattern)) {
            errors.push(this._messages.incorrect);
        }

        return errors;
    }
}


class EmailField extends TextField {
    constructor(DOMElement, options, messages) {
        options = options || {};
        options['maxLength'] = options['maxLength'] || DEFAULT_PARAMETERS.email.maxLength;
        options['minLength'] = options['minLength'] || DEFAULT_PARAMETERS.email.minLength;
        options['pattern'] = options['pattern'] || DEFAULT_PARAMETERS.email.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(DOMElement, options, messages);
    }
}


class LoginField extends TextField {
    constructor(DOMElement, options, messages) {
        options = options || {};
        options['maxLength'] = options['maxLength'] || DEFAULT_PARAMETERS.login.maxLength;
        options['minLength'] = options['minLength'] || DEFAULT_PARAMETERS.login.minLength;
        options['pattern'] = options['pattern'] || DEFAULT_PARAMETERS.login.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(DOMElement, options, messages);
    }
}


class PasswordField extends TextField {
    constructor(DOMElement, options, messages) {
        options = options || {};
        options['maxLength'] = options['maxLength'] || DEFAULT_PARAMETERS.password.maxLength;
        options['minLength'] = options['minLength'] || DEFAULT_PARAMETERS.password.minLength;
        options['pattern'] = options['pattern'] || DEFAULT_PARAMETERS.password.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(DOMElement, options, messages);
    }
}


class PasswordRepeatField extends Field {
    constructor(DOMElement, options, message) {
        super(DOMElement, options);
        this._referenceField = options['referenceField'];
        this._message = message || DEFAULT_TEXT_MESSAGES.match;
    }

    getErrors() {
        let errors = [];
        if (this._DOMElement.value != this._referenceField.value) {
            errors.push(this._message);
        }
        return errors;
    }

    setErrorOutput(DOMElement) {
        this._errorOutput = DOMElement;
        let callback = () => {

            this._errorOutput.innerHTML = this.getErrors().toString();
        };

        this._DOMElement.addEventListener('change', callback);
        this._referenceField.addEventListener('change', callback);
    }
}


class Form {
    constructor(fields, submitter) {
        this._fields = fields;
        this._submitter = submitter;
        this._setFieldsHook();

        this._submitter.addEventListener('click', (event) => {
            event.preventDefault();
            this.validateAndSubmit();
        });
    }

    _setFieldsHook() {
        for (let fieldName in this._fields) {
            this._fields[fieldName].setChangeCallBack(event => this.globalFormLogic(event));
        }
    }

    isValid() {
        let isValid = true;
        for (let fieldName in this._fields) {
            isValid = isValid && this._fields[fieldName].isValid();
        }

        return isValid;
    }

    validateAndSubmit() {
        if (this.isValid()) {
            this.sendData();
        } else {
            alert('Input valid data, please')
        }
    }

    sendData(){
        console.log('Tried to send data');
    }

    globalFormLogic() {
        console.log('Called global form logic');
    }
}


const LOGIN_SELECTORS = {
    form: '#signInForm',

    fields: {
        email: '#email',
        password: '#password'
    },

    errors: {
        email: '#errorEmail',
        password: '#errorPassword'
    },

    submitter: '#submitSignInButton'
};

export class SignInForm extends Form {
    constructor() {
        let form = document.querySelector(LOGIN_SELECTORS.form);

        let email = form.querySelector(LOGIN_SELECTORS.fields.email);
        let password = form.querySelector(LOGIN_SELECTORS.fields.password);

        let submitter = form.querySelector(LOGIN_SELECTORS.submitter);

        let emailField = new EmailField(email);
        emailField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.email));

        let passwordField = new PasswordField(password);
        passwordField.setErrorOutput(form.querySelector(LOGIN_SELECTORS.errors.password));

        super({
            email: emailField,
            password: passwordField
        }, submitter);
    }

    sendData() {
        let backendAPI = new BackendAPI();

        backendAPI.login(this._fields.email.getValue(), this._fields.password.getValue())
            .then(response => {
                if (response.status === 200) {
                    alert('Logged in successfully');
                    return response.json();
                } else {
                    alert('failed to login');
                }
                console.log(response);
            })
            .then(responseJson => {
                console.log(responseJson);
                window.location.replace("/");
            })
            .catch(err => {
                alert('Connection failed');
                console.log(err);
            });
    }
}


const REGISTER_SELECTORS = {
    form: '#signUpForm',

    fields: {
        login: '#login',
        email: '#email',
        password: '#password',
        passwordRepeat: '#password2',
    },

    errors: {
        email: '#errorEmail',
        password: '#errorPassword',
        login: '#errorLogin',
        passwordRepeat: '#errorPassword2',
    },

    submitter: '#submitSignUpButton'
};

export class SignUpForm extends Form {
    constructor() {
        let form = document.querySelector(REGISTER_SELECTORS.form);

        let email = form.querySelector(REGISTER_SELECTORS.fields.email);
        let login = form.querySelector(REGISTER_SELECTORS.fields.login);
        let password = form.querySelector(REGISTER_SELECTORS.fields.password);
        let passwordRepeat = form.querySelector(REGISTER_SELECTORS.fields.passwordRepeat);

        let submitter = form.querySelector(REGISTER_SELECTORS.submitter);

        let emailField = new EmailField(email);
        emailField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.email));

        let loginField = new LoginField(login);
        loginField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.login));

        let passwordField = new PasswordField(password);
        passwordField.setErrorOutput(form.querySelector(REGISTER_SELECTORS.errors.password));

        let passwordRepeatField = new PasswordRepeatField(passwordRepeat, {
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

    sendData() {
        let backendAPI = new BackendAPI();

        backendAPI.register(
            this._fields.email.getValue(),
            this._fields.login.getValue(),
            this._fields.password.getValue()
        )
            .then(response => {
                if (response.status === 200) {
                    alert('Signed up successfully');
                    window.location.replace("/");
                } else {
                    alert('failed to sign up');
                }
                console.log(response);
            })
            .catch(err => {
                alert('Connection failed');
                console.log(err);
            });
    }
}


