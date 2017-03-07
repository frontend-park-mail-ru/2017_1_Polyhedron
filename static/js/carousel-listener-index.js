(function(){

	let button = document.getElementById('cn-button'),
   wrapper = document.getElementById('cn-wrapper');

    //open and close menu when the button is clicked
	let open = true;
	//open menu with load of page
	this.innerHTML = "Close";
	classie.add(wrapper, 'opened-nav');
	
	button.addEventListener('click', handler, false);

	function handler(){
	  if(!open){
	    this.innerHTML = "Close";
	    classie.add(wrapper, 'opened-nav');
	  }
	  else{
	   this.innerHTML = "Menu";
		classie.remove(wrapper, 'opened-nav');
	  }
	  
	  open = !open;
	}

})();
