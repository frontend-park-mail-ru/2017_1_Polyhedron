
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
    short: 'Слишком короткий',
    long: 'Слишком длинный',
    incorrect: 'Недопустимое значение',
    match: 'Не совпадает'
};


export abstract class Field {
    protected _DOMElement: HTMLInputElement;
    protected _options: any;
    protected _errorOutput: Element;

    constructor(domElement, options) {
        this._DOMElement = domElement;
        this._options = options || {};
        this._errorOutput = null;
    }

    public abstract getErrors(): string[];

    public isValid(): boolean {
        return this.getErrors().length === 0;
    }

    public setErrorOutput(domElement: Element) {
        this._errorOutput = domElement;
        this._DOMElement.addEventListener('change', () => {

            this._errorOutput.innerHTML = this.getErrors().join('<br>').toString();
        });
    }

    public setChangeCallBack(callback) {
        this._DOMElement.addEventListener('change', callback);
    }
}


export class TextField extends Field {
    private _maxLength: number;
    private _minLength: number;
    private _pattern: string;
    private _messages: any;

    constructor(domeElement, options, messages) {
        super(domeElement, options);
        this._maxLength = this._options.maxLength;
        this._minLength = this._options.minLength;
        this._pattern = this._options.pattern;

        this._messages = messages;
    }

    public getValue() {
        return this._DOMElement.value;
    }

    public getErrors() {
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


export class EmailField extends TextField {
    constructor(domElement, options?, messages?) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.email.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.email.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.email.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(domElement, options, messages);
    }
}


export class LoginField extends TextField {
    constructor(domElement, options?, messages?) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.login.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.login.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.login.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(domElement, options, messages);
    }
}


export class PasswordField extends TextField {
    constructor(domElement, options?, messages?) {
        options = options || {};
        options.maxLength = options.maxLength || DEFAULT_PARAMETERS.password.maxLength;
        options.minLength = options.minLength || DEFAULT_PARAMETERS.password.minLength;
        options.pattern = options.pattern || DEFAULT_PARAMETERS.password.pattern;
        messages = messages || DEFAULT_TEXT_MESSAGES;

        super(domElement, options, messages);
    }
}


export class PasswordRepeatField extends Field {
    private _referenceField: HTMLInputElement;
    private _message: string;

    constructor(domElement, options?, message?) {
        super(domElement, options);
        this._referenceField = options.referenceField;
        this._message = message || DEFAULT_TEXT_MESSAGES.match;
    }

    public getErrors() {
        const errors = [];
        if (this._DOMElement.value !== this._referenceField.value) {
            errors.push(this._message);
        }
        return errors;
    }

    public setErrorOutput(domElement) {
        this._errorOutput = domElement;
        const callback = () => {

            this._errorOutput.innerHTML = this.getErrors().toString();
        };

        this._DOMElement.addEventListener('change', callback);
        this._referenceField.addEventListener('change', callback);
    }
}
