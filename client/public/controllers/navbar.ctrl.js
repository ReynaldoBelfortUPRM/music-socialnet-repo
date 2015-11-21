//Navigation bar logic:
angular.module('app').controller("NavBarController", function(){
	var vmodel = this; //Scope of this controller.
	//Navbar logout
	vmodel.logout = function(){
		//Erase current token and re-direct to the welcome page:
		sessionStorage.removeItem('clientAuthentication');
        window.location.href = "index.html";
	};

});