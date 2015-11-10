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

    vmodel.signin = function (event){
        //TODO $http documentation: https://docs.angularjs.org/api/ng/service/$http#jsonp
        //TODO Log-in detail encryption should be done here

            //Send log-in data for verification
            $http.post('/mvenue-database/login/', {email: vmodel.loginemail, password: vmodel.loginpassword}
                ).then(function successCallback(response){
                    //Direct user to the homepage
                    //TODO Warning, maybe $location.path() should be used instead.
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