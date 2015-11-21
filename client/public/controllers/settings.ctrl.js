//AngularJS controller
angular.module('app').controller("SettingsController", function($http){
	//Obtaining the scope obj. of the controller
	var vmodel = this;

	

    //-----------Client-Server interaction--------------
    //TODO Verify if the user is logged in first!
    //TODO The below code must exist on every other page that requires a logged user

    //Verify the existace ofa token. In other words, if a user is logged in.
	if(sessionStorage.getItem('clientAuthentication') === undefined || sessionStorage.getItem('clientAuthentication') === null){
		window.location.href = "index.html";
	}

	//------Event handlers-------

	vmodel.changeUserMode = function(){

		$http.get('/mvenue-database/changeUserMode/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        , {isBusiness: "TODO", targetID: 0, userName: "TODO"}).then(function successCallback(response){
        	//------Successful change of user mode-------

            //Replace current clientAuthentication object with a new one
            sessionStorage.setItem('clientAuthentication', JSON.stringify(response.data));

            alert("Now you are set as: " + response.data.userName);

            //Refresh page so that the User Name get's refreshed as well
            window.location.reload();

        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                	//Could not change user mode for some reason:
                    alert("Server Internal Error: " + response.data);
                }

        });
	};

    
});//End angular controller