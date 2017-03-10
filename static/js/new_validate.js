

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
    incorrect: 'Incorrect value'
};

const DEFAULT_REPEAT_MESSAGE = 'Not match';


class Field {
    constructor(DOMElement, options) {
        this._DOMElement = DOMElement;
        this._options = options || {};
        this._errorOutput = null;
    }

    getErrors() {
        // override this method
    }

    isValid() {
        return this.getErrors().length === 0;
    }

    setErrorOutput(DOMElement) {
        this._errorOutput = DOMElement;
        this._DOMElement.addEventListener('change', () => {

            let errors = this.getErrors();
            if (errors.length === 0) {
                this._errorOutput.innerHTML = '';
            } else {

            }
            this._errorOutput.innerHTML = errors.toString();
        })
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
            errors.push(this._messages.incorrect)
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
        this._message = message || DEFAULT_REPEAT_MESSAGE;
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

            let errors = this.getErrors();
            if (errors.length === 0) {
                this._errorOutput.innerHTML = '';
            } else {

            }
            this._errorOutput.innerHTML = errors.toString();
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
    }

    _setFieldsHook() {
        this._fields.forEach(
            field => {
                field.setChangeCallBack(event => this.globalFormLogic(event));
            }
        );
    }

    isValid() {
        let isValid = true;
        this._fields.forEach(field => {
            isValid = isValid && field.isValid();
        });

        return isValid;
    }

    validateAndSubmit() {
        if (this.isValid()) {
            this.sendData();
        }
    }

    sendData(){
        //need to override
    }

    globalFormLogic(changeEvent) {
        alert('worked');
    }
}


const LOGIN_SELECTORS = {
    form: '#signInForm',

    fields: {
        email: '#email',
        password: '#password'
    },

    submitter: '#submitSignInButton'
};

class LoginForm extends Form {
    constructor() {
        let form = document.querySelector(LOGIN_SELECTORS.form);
        let email = form.querySelector(LOGIN_SELECTORS.fields.email);
        let password = form.querySelector(LOGIN_SELECTORS.fields.password);
        let submitter = form.querySelector(LOGIN_SELECTORS.submitter);


        console.log(email);
        console.log(password);

        super([
            new EmailField(email), new PasswordField(password)
        ], submitter);
    }
}


function testEmail() {
    let dom = document.getElementById('email');
    let domErr = document.getElementById('errorEmail');

    let field = new EmailField(dom);
    field.setErrorOutput(domErr);

    window.emailField = field;
}

function testLogin() {
    let dom = document.getElementById('login');
    let domErr = document.getElementById('errorLogin');

    let field = new LoginField(dom);
    field.setErrorOutput(domErr);

    window.loginField = field;
}

function testPassword() {
    let dom = document.getElementById('password');
    let domErr = document.getElementById('errorPassword');

    let field = new PasswordField(dom);
    field.setErrorOutput(domErr);

    window.passwordField = field;
}

function testPasswordRepeat() {
    let dom = document.getElementById('password');
    let ref = document.getElementById('password2');
    let domErr = document.getElementById('errorPassword2');

    let field = new PasswordRepeatField(dom, {referenceField: ref});
    field.setErrorOutput(domErr);

    window.passwordRepeatField = field;
}

function testLoginForm() {
    window.loginForm = new LoginForm();
}

(function () {
    window.EmailField = EmailField;
    window.LoginField = LoginField;
    window.PasswordField = PasswordField;
    window.PasswordRepeatField = PasswordRepeatField;
    window.Form = Form;
    window.testEmail = testEmail;
    window.testLogin = testLogin;
    window.testPassword = testPassword;
    window.testPasswordRepeat = testPasswordRepeat;
    window.testLoginForm = testLoginForm;
    console.log('ok');
})();

