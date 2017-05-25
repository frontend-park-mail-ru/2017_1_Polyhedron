"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_PARAMETERS = {
    email: {
        minLength: 2,
        maxLength: 100,
        pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    login: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-z0-9_]*$/i,
    },
    password: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-z0-9_]*$/i,
    }
};
const DEFAULT_TEXT_MESSAGES = {
    short: 'Слишком короткий',
    long: 'Слишком длинный',
    incorrect: 'Недопустимое значение',
    match: 'Не совпадает'
};
class Field {
    constructor(domElement, options) {
        this._DOMElement = domElement;
        this._options = options || {};
        this._errorOutput = null;
    }
    isValid() {
        return this.getErrors().length === 0;
    }
    setErrorOutput(domElement) {
        this._errorOutput = domElement;
        this._DOMElement.addEventListener('change', () => {
            this._errorOutput.innerHTML = this.getErrors().join('<br>').toString();
        });
    }
    setChangeCallBack(callback) {
        this._DOMElement.addEventListener('change', callback);
    }
}
exports.Field = Field;
class TextField extends Field {
    constructor(domeElement, options, messages) {
        super(domeElement, options);
        this._maxLength = this._options.maxLength;
        this._minLength = this._options.minLength;
        this._pattern = this._options.pattern;
        this._messages = messages;
    }
    getValue() {
        return this._DOMElement.value;
    }
    getErrors() {
        const fieldValue = this._DOMElement.value;
        const errors = [];
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
exports.TextField = TextField;
class EmailField extends TextField {
    constructor(domElement, options, messages) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.email.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.email.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.email.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;
        super(domElement, options, messages);
    }
}
exports.EmailField = EmailField;
class LoginField extends TextField {
    constructor(domElement, options, messages) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.login.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.login.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.login.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;
        super(domElement, options, messages);
    }
}
exports.LoginField = LoginField;
class PasswordField extends TextField {
    constructor(domElement, options, messages) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.password.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.password.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.password.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;
        super(domElement, options, messages);
    }
}
exports.PasswordField = PasswordField;
class PasswordRepeatField extends Field {
    constructor(domElement, options, message) {
        super(domElement, options);
        this._referenceField = options.referenceField;
        this._message = message || DEFAULT_TEXT_MESSAGES.match;
    }
    getErrors() {
        const errors = [];
        if (this._DOMElement.value !== this._referenceField.value) {
            errors.push(this._message);
        }
        return errors;
    }
    setErrorOutput(domElement) {
        this._errorOutput = domElement;
        const callback = () => {
            this._errorOutput.innerHTML = this.getErrors().toString();
        };
        this._DOMElement.addEventListener('change', callback);
        this._referenceField.addEventListener('change', callback);
    }
}
exports.PasswordRepeatField = PasswordRepeatField;
//# sourceMappingURL=form_fields.js.map