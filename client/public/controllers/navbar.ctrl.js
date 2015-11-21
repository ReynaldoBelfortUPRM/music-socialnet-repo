//Navigation bar logic:
angular.module('app').controller("NavBarController", function(){
	var vmodel = this; //Scope of this controller.

	//Populate NavBar data:
	vmodel.userName = $.parseJSON(sessionStorage.getItem('clientAuthentication')).userName;

	//Navbar logout
	vmodel.logout = function(){
		//Erase current token and re-direct to the welcome page:
		sessionStorage.removeItem('clientAuthentication');
        window.location.href = "index.html";
	};

});