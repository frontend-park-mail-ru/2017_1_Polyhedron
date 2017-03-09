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
const submitFormButton = document.getElementById('submitFormButton');
const MAX_LENGTH = 14;


class Form{
	constructor(form) {
        this.fields = {
        	'login': {
        		name: "login",
        		value: false,
        		error: true
        	}, 
         	'email': {
         		name: "email",
        		value: false,
        		error: true
        	},
         	'password': {
         		name: "password",
        		value: false,
        		error: true
        	},
         	'password2': {
         		name: "password2",
        		value: false,
        		error: true
        	}
        };
        this.globalError = true;

        if(submitFormButton != null){
			submitFormButton.addEventListener("click", () => this.checkToSend());
		}

        let elems = form.elements;
        for (let key in  this.fields) {
        	let nameField = this.fields[key].name;
        	if (nameField in elems){
				elems[nameField].addEventListener("change", () => this.validate(nameField));
				submitFormButton.addEventListener("click", () => this.validate(nameField));
			}
		}
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
			error[nameField].innerHTML='Данное поле обязательно для заполнения';
		} else if (valueField.length > MAX_LENGTH){
					error[nameField].innerHTML = 'Поле должно содержать меньше ' + MAX_LENGTH + ' символов';
				} else if ( !patterns[nameField + 'Pattern'].test(valueField) ){
							if (nameField == 'email') {
								error[nameField].innerHTML='Поле не является валидным e-mail';
							} else {
								error[nameField].innerHTML='Поле должно содержать только символы A-z, 0-9 и _';
							}
						} else {
							this.fields[nameField].error = false;
						}
    }

	checkToSend(){
		//need to override
		console.log("Need to override 'checkToSend()' method");
	}

	sendData(){
		//need to override
		console.log("Need to override 'sendData()' method");
	}
};

class SignUpForm extends Form{
	checkToSend(){
		let result = false;
		for (let key in this.fields) {
			result +=  this.fields[key].error;
		}

		if (result == false){
			this.sendData();
		}
	}

	sendData(){
		let session = new ClientServerAPI();
		session.register(this.fields['email'].value, 
						 this.fields['login'].value, 
						 this.fields['password'].value).
		then(data => {}).catch(err => {});
	}
};

class SignInForm extends Form{
	checkToSend(){
		let result = this.fields['email'].error || this.fields['password'].error;

		if (result == false){
			this.sendData();
		}
	}

	sendData(){
		let session = new ClientServerAPI();
		session.login(this.fields['login'].value, this.fields['password'].value)
		.then(data => {}).catch(err => {});
	}
};


(function(){
	let signInForm = document.getElementById("signInForm");
	let signUpForm = document.getElementById("signUpForm");

	if(signUpForm == null && signInForm == null){
		console.log("Error, form not found");
	} else {
		if(signInForm != null){
			// Переписать блок при помощи модулей и require.js
			let dataSignInForm = new SignInForm(signInForm);
			document.body.userData = dataSignInForm; //Добавим в DOM
		} else {
			// Переписать блок при помощи модулей и require.js
			let dataSignUpForm = new SignUpForm(signUpForm);
			document.body.userData = dataSignUpForm; //Добавим в DOM
		}
	}
	/*let signInForm = document.getElementById("signInForm");
	if(signInForm == null){
		console.log("Error, form not found");
	} else {
			let dataSignInForm = new Form(signInForm);
			document.body.userData = dataSignInForm; //Добавим в DOM
	}*/
})();