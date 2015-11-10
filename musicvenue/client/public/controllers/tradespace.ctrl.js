//------------------Tradespace Wall functionality-----------------


$(document).ready( function() {

//------Code runs when the document is ready:--------

//Masonry plugin code
var container = document.querySelector('#masonry');

var masonry = new Masonry(container, {
columnWidth: 30,
itemSelector: '.announcement' //HTML element  to be used containing the .announcement class.
});

//Layout the items generated by AngularJS
masonry.layout();

});

//AngularJS funcitons
angular.module('app').controller("TradespaceController", function($http){
	var vmodel = this; //The scope of this controller.

	//Variable initializations
    vmodel.announcements = [];
    vmodel.newAnn = {
                "trade_id": 0,
                "user_id": 0,
                "title": '',    
                "trade_description": '',
                "phone": '',
                "price": '',
                "seller_name": '',
                "tags": [],
                "email": '',
                "images": 0
              };


    //--------Event handling-------------

	//Adding new announcements:
	vmodel.addNewAnn = function() {

		var eAddr = '';
		if(vmodel.newAnn.includeEmail)
		{
			eAddr = "anadido@anuncio.com";
		}

		//Add the new announcement at the beginning of the list
		vmodel.announcements.push({
			    "trade_id": 1,
			    "user_id": 1,
			    "title": vmodel.newAnn.title,
			    "trade_description": vmodel.newAnn.trade_description,
			    "phone": vmodel.newAnn.phone,
			    "price": vmodel.newAnn.price,
			    "seller_name": "Gonzalo Ortiz",
			    "tags": vmodel.newAnn.tags,
			    "email": eAddr,
			    "images": 0
			  });


		//Cleaning new announcement data
		vmodel.newAnn = {
			    "trade_id": 0,
			    "user_id": 0,
			    "title": '',
			    "trade_description": '',
			    "phone": '',
			    "price": '',
			    "seller_name": '',
			    "tags": [],
			    "email": '',
			    "images": 0
			  };

		//Hide the new announcement window:
		$('#addAnnouncement').modal('hide');
	};

	//Adding tags for the new announcement
	vmodel.addTagNewAnn = function() {
		vmodel.newAnn.tags.push(vmodel.newAnn.singleTag);

		//Clean the string so user can add more tags
		vmodel.newAnn.singleTag = '';
	};


    //TODO----------------Loading Dummy data for testing-----------------------
    // $http.get('../data/tradespace.json').success(function(response){
    //          vmodel.announcements = response.announcements;
    // });

	//Retrieving JSON Data from database:
	$http.get('/mvenue-database/tradespace/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        ).then(function successCallback(response){
            //Load data from server
            vmodel.announcements = response.announcements;

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

    //TODO If everything works fine, dele this code below
	// $http.get('/mvenue-database/tradespace/').success(function(response)
	// {
	// 	//Load data on the view
	// 	vmodel.announcements = response.announcements;
	// });


});

