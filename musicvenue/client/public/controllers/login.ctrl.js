angular.module('app').controller("LoginControl", function($http, $location){

    var vmodel = this; //Scope of this controller.
    //var emaiil=vmodel.loginemail;
    //var pass= vmodel.loginpass;

    //vmodel.uusers=[];
    //vmodel.inputname ="this is the input name";

    // $http.get('/mvenue-database/register/').success(function(data){
    //       vmodel.uusers=data;
    // });


    // vmodel.signin= function(){

    //     var email = vmodel.loginemail;
    //     var pass= vmodel.loginpass;
    //     if(email=="admi@admi.com"&& pass =="admi"){
    //         $location.path('/homepage.html');
    //     }
    //     else{
    //         alert("invalid username or password");
    //     }

    // };

    vmodel.signin = function (){
        //TODO $http documentation: https://docs.angularjs.org/api/ng/service/$http#jsonp

        //Note: Normally, SSL certificates are required for sending credentials over http securely
        //Send log-in data for verification.             
        //Note: By the use  of sessionStorage cookie from browser, the user will be  logged in as long as
        //the browser tab is not closed, or the token gets expired.
        $http.post('/mvenue-database/login/', {email: vmodel.loginemail, password: vmodel.loginpassword}
            ).then(function successCallback(response){
                //TODO When user is logged out, the token must be erased.
                //Retrieve token and store in browser's session cookie:
                sessionStorage.setItem('clientAuthentication', JSON.stringify({loggedIn: true, token: response.data.token}));

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

});