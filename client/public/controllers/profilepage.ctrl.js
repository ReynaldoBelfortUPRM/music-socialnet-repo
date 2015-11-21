

angular.module('app').controller("ProfileController", function($http){
    //Object initializations
    var vmodel = this; //The scope of this controller.
    vmodel.groupData = [];


    //-------Event Handling----------
    
    //----------------Loading Dummy data for testing-----------------------
    $http.get('../data/group.json').success(function(response){
             vmodel.groupData = response.groupData;
    });

    //-----------Client-Server interaction--------------

    //Verify the existace ofa token. In other words, if a user is logged in.
    if(sessionStorage.getItem('clientAuthentication') === undefined || sessionStorage.getItem('clientAuthentication') === null){
        window.location.href = "index.html";
    }

    
    // $http.get('/mvenue-database/profilepage/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
    //     ).then(function successCallback(response){
    //         //------Recieve and manage response data-------


            
    //     }, function errorCallback(response){
    //             if(response.status == 401){
    //                 alert("Authentication error! Your session may have been expired. Please log-in again!");
    //                 //Erase current token from the browser cookie
    //                 sessionStorage.removeItem('clientAuthentication');
    //                 //Re-direct user to the log-in page
    //                 window.location.href = "login.html";
    //             }
    //             else{
    //                 alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
    //             }

    //     });

});

