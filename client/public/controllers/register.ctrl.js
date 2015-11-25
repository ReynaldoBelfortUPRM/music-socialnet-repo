angular.module('app').controller("RegisterControl", function($http){

    var vmodel = this; //Scope of this controller.

    vmodel.register = function (){

            if(vmodel.password== vmodel.repassword) {

                console.log("se llamara la funcion");
                $http.post('/mvenue-database/register/', {
                    first_name: vmodel.first_name,
                    last_name: vmodel.last_name,
                    email: vmodel.email,
                    password: vmodel.password
                }).success(function (response) {
                    //Succesful registration
                    //Re-direct user to the login page
                    window.location.href = "index.html";
                });
            }
            else{
                alert("Passwords do not match.");
            }

    };
    vmodel.cancel= function(){
        window.location.href = "index.html";
    };


});