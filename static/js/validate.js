
const BackendAPI = require('../../core/backend_rest_lib');

const LOGIN_FORM_INFO = {
    fields: {
        email: 'email',
        password: 'password',
    },

    errorLabelIDs: {
        email: 'errorEmail',
        password: 'errorPassword'
    },

    submitID: 'submitSignInButton'
};

const REGISTRATION_FORM_INFO = {
    fields: {
        email: "email",
        login: "login",
        password: "password",
        password2: "password2"
    },

    errorLabelIDs: {
        email: 'errorEmail',
        password: 'errorPassword',
        password2: 'errorPassword2',
        login: 'errorLogin'
    },

    submitID: "submitSignUpButton"
};

const PATTERNS = {
    loginPattern: /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i,
    passwordPattern: /[_a-zA-Z0-9]$/i,
    password2Pattern: /[_a-zA-Z0-9]$/i,
    emailPattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
};

const error = {
    login: document.getElementById('errorLogin'),
    password: document.getElementById('errorPassword'),
    password2: document.getElementById('errorPassword2'),
    email: document.getElementById('errorEmail')
};

const MAX_LENGTH = 14;

const ERROR_LABEL = {
    nullLength: 'Данное поле обязательно для заполнения',
    overflowLength: 'Поле должно содержать меньше ' + MAX_LENGTH + ' символов',
    symbols: 'Поле должно содержать только символы A-z, 0-9 и _',
    email: 'Поле не является валидным e-mail',
    password: 'Пароли не совпадают'
};


class Form{
    constructor(form, fields) {
        this.fields = {};
        for (let key in fields) {
            if(key != 'submitFormButton') {
                this.fields[key] = {};
                this.fields[key].value = false;
                this.fields[key].error = true;
            }
        }

        let submitFormButton = document.getElementById(fields["submitFormButton"]);
        if(submitFormButton != null){
            submitFormButton.addEventListener("click", () => this.validateBeforeSubmit());
        }

        let elems = form.elements;
        for (let key in  this.fields) {
            if (key in elems){
                elems[key].addEventListener("change", () => this.validate(key));
            }
        }
    }

    validateBeforeSubmit(){
        for (let key in this.fields) {
            this.validate(key);
        }

        this.checkToSend();
    }

    resetError(key){
        error[key].innerHTML='';
        this.fields[key].error = true;
    }

    validate(nameField){
        let valueField = document.getElementById(nameField).value;
        this.fields[nameField].value = valueField;
        this.resetError(nameField);

        if (valueField.length == 0){
            error[nameField].innerHTML = ERROR_LABEL.nullLength;
        } else if (valueField.length > MAX_LENGTH){
            error[nameField].innerHTML = ERROR_LABEL.overflowLength;
        } else if ( nameField == 'password2' && this.fields['password'].value != valueField) {
            error['password2'].innerHTML = ERROR_LABEL.password;
        } else if ( !PATTERNS[nameField + 'Pattern'].test(valueField) ){
            if (nameField === 'email') {
                error[nameField].innerHTML = ERROR_LABEL.email;
            } else {
                error[nameField].innerHTML = ERROR_LABEL.symbols;
            }
        } else {
            this.fields[nameField].error = false;
        }
    }

    checkToSend(){
        //need to override
        console.log("Need to override 'checkToSend()' method");
        throw "Need to override 'checkToSend()' method";
    }

    sendData(){
        //need to override
        console.log("Need to override 'sendData()' method");
        throw "Need to override 'checkToSend()' method";
    }
}

class SignUpForm extends Form{
    constructor(form) {
        super(form, REGISTRATION_FORM_INFO);
    }

    checkToSend(){
        let errors = false;
        for (let key in this.fields) {
            errors =  errors || this.fields[key].error;
        }

        if (!errors){
            this.sendData();
        }
    }

    sendData(){
        let session = new BackendAPI();
        session.register(this.fields['email'].value,
            this.fields['login'].value,
            this.fields['password'].value).
        then(() => {}).catch(() => {}); //then - success, err - fail
        // TODO write promise
    }
}

class SignInForm extends Form{
    constructor(form) {
        super(form, LOGIN_FORM_INFO);
    }

    checkToSend(){
        let errors = this.fields['email'].error || this.fields['password'].error;

        if (!errors){
            this.sendData();
        }
    }

    sendData(){
        let session = new BackendAPI();
        session.login(this.fields['email'].value, this.fields['password'].value)
            .then(() => {}).catch(() => {}); //then - success, err - fail
        // TODO write promise
    }
}


module.exports.SignInForm = SignInForm;
module.exports.SignUpForm = SignUpForm;

/*
(function(){
    let signInForm = document.getElementById("signInForm");
    let signUpForm = document.getElementById("signUpForm");

    if(signUpForm == null && signInForm == null){
        console.log("Error, form not found");
    } else {
        if(signInForm != null){
            // TODO Переписать блок при помощи модулей и require.js
            document.body.userData = new SignInForm(signInForm, LOGIN_FORM_INFO); //Добавим в DOM
        } else {
            // TODO Переписать блок при помощи модулей и require.js
            document.body.userData = new SignUpForm(signUpForm, REGISTRATION_FORM_INFO); //Добавим в DOM
        }
    }
})();
*/
