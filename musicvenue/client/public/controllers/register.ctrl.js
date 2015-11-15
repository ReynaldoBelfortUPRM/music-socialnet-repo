angular.module('app').controller("RegisterControl", function($http){

    var vmodel = this; //Scope of this controller.

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