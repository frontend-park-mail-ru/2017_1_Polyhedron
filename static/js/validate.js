const loginAndPassword_pattern = /^[a-z][a-z0-9]*?([_][a-z0-9]+){0,2}$/i;
const email_pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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

  checkSubmitButton(){
	if(!this.error.login && !this.error.email &&
	   !this.error.pass && !this.error.pass2){
		submitForm.disabled = 0;
	}
  }

  validateLogin(){    
   let login = document.getElementById('username').value;
   this.login = login; 
   this.resetError('login');

   if (login.length == 0){
 	errorLogin.innerHTML='Данное поле обязательно для заполнения';
   } else {
	   if (login.length > MAX_LENGTH){
	 	errorLogin.innerHTML = 'Поле должно содержать меньше ' + MAX_LENGTH + ' символов';
	   } else {
		   if ( !loginAndPassword_pattern.test(login) ){
		 	errorLogin.innerHTML='Данное поле должно содержать только символы A-z, 0-9 и _';
		   } else {
			this.error.errorLogin = false;
		   }
	   }
    }
   this.checkSubmitButton();						
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
		   if (!loginAndPassword_pattern.test(password)) {
		 	errorPassword.innerHTML='Данное поле должно содержать только символы A-z, 0-9 и _';
		   } else {
			this.error.errorPass = false;
		   }
	  }
    }
   this.checkSubmitButton();
  }

  validatePassword2(){    
   let password2 = document.getElementById('password2').value;
   this.resetError('password2');

   if (this.password != password2) {
	errorPassword2.innerHTML='Пароли должны совпадать';
   } else {
	this.error.errorPass2 = false;
	submitForm.disabled = 0;
   }
   this.checkSubmitButton();
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
		   if ( !email_pattern.test(email) ){
		 	errorEmail.innerHTML='Данное поле не является валидным email';
		   } else {
			this.error.errorEmail = false;
		   }
	   }
    }
    this.checkSubmitButton();			
  }

  constructor(form) {
    let elems = form.elements;
    this.login = "";
    this.email = "";
    this.password = "";
    this.error = { errorLogin: true,
		   errorEmail: true,
		   errorPass: true,
		   errorPass2: true };

    //submitForm.addEventListener("click", () => this.sendData());

    if(elems.login != null){
    	elems.login.addEventListener("change", () => this.validateLogin());
    }
    if(elems.email != null){
    	elems.email.addEventListener("change", () => this.validateEmail());
    }
    if(elems.password != null){
    	elems.password.addEventListener("change", () => this.validatePassword());
    }
    if(elems.password2 != null){
    	elems.password2.addEventListener("change", () => this.validatePassword2());
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
