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
            console.log("cliqueaste el signin");
            $http.post('/mvenue-database/login/', {email: vmodel.loginemail, password: vmodel.loginpassword}).success(function(dbData){
               console.log(JSON.stringify(dbData));
            });
    }

});