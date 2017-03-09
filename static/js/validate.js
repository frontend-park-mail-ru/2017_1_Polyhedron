const loginFields = {
    email: "email",
    password: "password",
    submitFormButton: "submitSignInButton"
}
const registrationFields = {
    email: "email",
    login: "login",
    password: "password",
    password2: "password2",
    submitFormButton: "submitSignUpButton"
}
const patterns = {
	loginPattern: /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i,
	passwordPattern: /[_a-zA-Z0-9]$/i,
	password2Pattern: /[_a-zA-Z0-9]$/i,
	emailPattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
}
const error = {
	login: document.getElementById('errorLogin'),
	password: document.getElementById('errorPassword'),
	password2: document.getElementById('errorPassword2'),
	email: document.getElementById('errorEmail')
}

const MAX_LENGTH = 14;

const errorLabel = {
    nullLength: 'Данное поле обязательно для заполнения',
    overflowLength: 'Поле должно содержать меньше ' + MAX_LENGTH + ' символов',
    symbols: 'Поле должно содержать только символы A-z, 0-9 и _',
    email: 'Поле не является валидным e-mail',
    password: 'Пароли не совпадают'
}


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
        for (let key in  this.fields) {
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
			error[nameField].innerHTML = errorLabel.nullLength;
		} else if (valueField.length > MAX_LENGTH){
					error[nameField].innerHTML = errorLabel.overflowLength;
				} else if ( nameField == 'password2' && this.fields['password'].value != valueField) {
                                error['password2'].innerHTML = errorLabel.password;
                        } else if ( !patterns[nameField + 'Pattern'].test(valueField) ){
                                    if (nameField === 'email') {
                                        error[nameField].innerHTML = errorLabel.email;
                                    } else {
                                        error[nameField].innerHTML = errorLabel.symbols;
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
};

class SignUpForm extends Form{
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
		let session = new ClientServerAPI();
		session.register(this.fields['email'].value, 
						 this.fields['login'].value, 
						 this.fields['password'].value).
		then(data => {}).catch(err => {}); //then - succses, err - fail
        // TODO write promise
	}
};

class SignInForm extends Form{
	checkToSend(){
		let errors = this.fields['email'].error || this.fields['password'].error;

		if (!errors){
			this.sendData();
		}
	}

	sendData(){
		let session = new ClientServerAPI();
		session.login(this.fields['email'].value, this.fields['password'].value)
		.then(data => {}).catch(err => {}); //then - succses, err - fail
        // TODO write promise
	}
};


(function(){
	let signInForm = document.getElementById("signInForm");
	let signUpForm = document.getElementById("signUpForm");

	if(signUpForm == null && signInForm == null){
		console.log("Error, form not found");
	} else {
		if(signInForm != null){
			// TODO Переписать блок при помощи модулей и require.js
			let dataSignInForm = new SignInForm(signInForm, loginFields);
			document.body.userData = dataSignInForm; //Добавим в DOM
		} else {
			// TODO Переписать блок при помощи модулей и require.js
			let dataSignUpForm = new SignUpForm(signUpForm, registrationFields);
			document.body.userData = dataSignUpForm; //Добавим в DOM
		}
	}
})();