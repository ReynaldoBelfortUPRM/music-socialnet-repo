angular.module('app').controller("LoginControl", function($http, $location){

    var vmodel = this; //Scope of this controller.

    vmodel.signin = function (){
        //TODO $http documentation: https://docs.angularjs.org/api/ng/service/$http#jsonp

        //Note: Normally, SSL certificates are required for sending credentials over http securely
        //Send log-in data for verification.             
        //Note: By the use  of sessionStorage cookie from browser, the user will be  logged in as long as
        //the browser tab is not closed, or the token gets expired.
        $http.post('/mvenue-database/login/', {email: vmodel.loginemail, password: vmodel.loginpassword}
            ).then(function successCallback(response){
                
                //Retrieve client authentication object from server and store in browser's session cookie:
                sessionStorage.setItem('clientAuthentication', JSON.stringify(response.data));

                //Direct user to the homepage
                window.location.href = "homepage.html";

        }, function errorCallback(response){
                if(response.status == 400){
                    alert("Invalid username or password. Please try again.");
                }
                else{
                    alert("There was an internal error. Please try again soon.");
                }

        });
}

    vmodel.forgotpasss = function(){
        window.location.href = "forgotpass.html";

    }

});