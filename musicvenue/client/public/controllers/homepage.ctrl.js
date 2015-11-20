//---------Homepage logic--------------
$(document).ready( function() {

//------Code runs when the document is ready:--------

//Masonry plug-in ininitialization
var container = document.querySelector('#masonry');

var masonry = new Masonry(container, {
	columnWidth: 30,
itemSelector: '.post' //HTML element to be used containing the .post class.
});

//Layout the posts generated by AngularJS
masonry.layout();

});

//Audio.js plug-in initialization
audiojs.events.ready(function() {
	var as = audiojs.createAll();
});


//AngularJS controller
angular.module('app').controller("HomepageController", function($http){
	//Obtaining the scope obj. of the controller
	var vmodel = this;

	//------Event handlers-------

	//User asking for file upload
	vmodel.openUpload = function(upType){
		//Show or hide the upload form
		vmodel.showUpload = !vmodel.showUpload;

		if(vmodel.showUpload){
			//Update upload header value:
			switch(upType){
				case 0:
					vmodel.uploadTitle = "image";
				break;

				case 1:
					vmodel.uploadTitle = "audio";
				break;

				case 2:
					vmodel.uploadTitle = "video";
				break;
			}
		}

	};

	//TODO-----------Dummy operations: for design purposes-----------------
	// vmodel.showUpload = true;
	//vmodel.post_type = 1;

    //-----------Client-Server interaction--------------
    //TODO Verify if the user is logged in first!
    //TODO The below code must exist on every other page that requires a logged user

    //Verify the existace ofa token. In other words, if a user is logged in.
	if(sessionStorage.getItem('clientAuthentication') === undefined || sessionStorage.getItem('clientAuthentication') === null){
		window.location.href = "index.html";
	}

    $http.get('/mvenue-database/homepage/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        ).then(function successCallback(response){
        	//------Recieve and manage response data-------

            //Load data from server
            vmodel.posts = response.data.posts;

        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data);
                }

        });

});