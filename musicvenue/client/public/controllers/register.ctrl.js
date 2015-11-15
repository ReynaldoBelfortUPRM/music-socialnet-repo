//angular.module('app').controller("RegisterControl", function($http){
//
//    var vmodel = this; //Scope of this controller.
//
//
//    // $http.get('/mvenue-database/register/').success(function(data){
//    //       vmodel.uusers=data;
//    // });
//    //
//    //vmodel.add = function (event){
//    //    if(event.keyCode==13){
//    //        $http.post('/mvenue-database/register/', {text: vmodel.inputname}).success(function(dbData){
//    //            vmodel.uusers = dbData;
//    //        });
//    //
//    //    }
//    //
//    //};
//    vmodel.create = function (){
//            console.log("antes");
//
//
//            if(vmodel.password== vmodel.repassword) {
//                $http.post('/mvenue-database/register/', {
//                    first_name: vmodel.first_name,
//                    last_name: vmodel.last_name,
//                    email: vmodel.email,
//                    password: vmodel.password
//                }).success(function (dbData) {
//                    vmodel.uusers = dbData;
//                });
//            }
//            else{
//                alert("Passwords do not match.");
//            }
//
//            console.log("despues");
//
//    };
//    vmodel.cancel= function(){
//        window.location.href = "index.html";
//
//    };
//
//});




angular.module('app').controller("RegisterControl", function($http, $location){

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



    vmodel.register = function (){
            console.log("antes");


            if(vmodel.password== vmodel.repassword) {
                $http.post('/mvenue-database/register/', {
                    first_name: vmodel.first_name,
                    last_name: vmodel.last_name,
                    email: vmodel.email,
                    password: vmodel.password
                }).success(function (dbData) {
                    vmodel.uusers = dbData;
                });
            }
            else{
                alert("Passwords do not match.");
            }

            console.log("despues");

    };
    vmodel.cancel= function(){
        window.location.href = "index.html";

    };




});