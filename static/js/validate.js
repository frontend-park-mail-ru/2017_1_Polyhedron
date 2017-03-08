const loginPattern = /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i;
const passwordPattern = /[_a-zA-Z0-9]$/i;
const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const errorLogin = document.getElementById('errorLogin');
const errorPassword = document.getElementById('errorPassword');
const errorPassword2 = document.getElementById('errorPassword2');
const errorEmail = document.getElementById('errorEmail');
const submitForm = document.getElementById('submitForm');
const MAX_LENGTH = 14;


class Data {
	resetError(key){
		switch(key){
			case 'login':
			errorLogin.innerHTML='';
			this.error.errorLogin = true;
			break;
			case 'password':
			errorPassword.innerHTML='';
			this.error.errorPass = true;		
			break;
			case 'password2':
			errorPassword2.innerHTML='';
			this.error.errorPass2 = true;	
			break;
			case 'email':
			errorEmail.innerHTML='';
			this.error.errorEmail = true;	
			break;
		}
	}

	checkToSend(){
		let result = false;
		for (let key in this.error) {
			result +=  this.error[key];
		}

		if (result == false){
			this.sendData();
		}
	}

	validateLogin(){    
		let login = document.getElementById('username').value;
		this.login = login; 
		this.resetError('login');

		if (login.length == 0){
			errorLogin.innerHTML='Данное поле обязательно для заполнения';
		} else if (login.length > MAX_LENGTH){
					errorLogin.innerHTML = 'Поле должно содержать меньше ' + MAX_LENGTH + ' символов';
				} else if ( !loginPattern.test(login) ){
						errorLogin.innerHTML='Поле должно содержать только символы A-z, 0-9 и _';
						} else {
							this.error.errorLogin = false;
						}					
	}

	validatePassword(){    
		let password = document.getElementById('password').value;
		this.password = password;
		this.resetError('password');

		if (password.length == 0){
			errorPassword.innerHTML='Данное поле обязательно для заполнения';
		} else {
			if (password.length > MAX_LENGTH){
				errorPassword.innerHTML='Поле должно содержать меньше ' + MAX_LENGTH + ' символов';
			} else {
				if (!passwordPattern.test(password)) {
					errorPassword.innerHTML='Поле должно содержать только символы A-z, 0-9 и _';
				} else {
					this.error.errorPass = false;
				}
			}
		}
	}

	validatePassword2(){    
		let password2 = document.getElementById('password2').value;
		this.resetError('password2');

		if (this.password != password2) {
			errorPassword2.innerHTML='Пароли должны совпадать';
		} else {
			this.error.errorPass2 = false;
		}
	}

	validateEmail(){    
		let email = document.getElementById('email').value;
		this.email = email;
		this.resetError('email');

		if (email.length == 0){
			errorEmail.innerHTML='Данное поле обязательно для заполнения';
		} else {
			if (email.length > MAX_LENGTH){
				errorEmail.innerHTML='Поле должно содержать меньше ' + MAX_LENGTH + ' символов';
			} else {
				if ( !emailPattern.test(email) ){
					errorEmail.innerHTML='Поле не является валидным email';
				} else {
					this.error.errorEmail = false;
				}
			}
		}			
	}

	sendData(){
		let xhr = new XMLHttpRequest();

		let json;
		if(this.email.length == 0) {
			json = JSON.stringify({
				login: this.login,
				password: this.password,	
			});
			xhr.open("POST", '/api/user/login', true);
		} else {
			json = JSON.stringify({
				email: this.email,
				login: this.login,
				password: this.password,	
			});
			xhr.open("POST", '/api/user/registr', true);
		}

		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function () {
			if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				console.log("Successful sending");
			};
		};
		xhr.send(json);
	}

	constructor(form) {
		let elems = form.elements;
		this.login = "";
		this.email = "";
		this.password = "";
		this.error = {};

		if(submitForm != null){
			submitForm.addEventListener("click", () => this.checkToSend());
		}
		if(elems.login != null){
		    	elems.login.addEventListener("change", () => this.validateLogin());
		    	this.error.errorLogin = true;
		    	submitForm.addEventListener("click", () => this.validateLogin());
		}
		if(elems.email != null){
		    	elems.email.addEventListener("change", () => this.validateEmail());
		    	this.error.errorEmail = true;
		    	submitForm.addEventListener("click", () => this.validateEmail());
		}
		if(elems.password != null){
		    	elems.password.addEventListener("change", () => this.validatePassword());
		    	this.error.errorPass = true;
		    	submitForm.addEventListener("click", () => this.validatePassword());
		}
	    if(elems.password2 != null){
	    	elems.password2.addEventListener("change", () => this.validatePassword2());
			this.error.errorPass2 = true;
			submitForm.addEventListener("click", () => this.validatePassword2());
		}
	}
};

(function(){
	let form = document.getElementById("form");
	if(form == null){
		console.log("Error, form not found");
	} else {
		let data = new Data(form);
		document.body.userData = data; //Добавим в DOM
	}
})();
