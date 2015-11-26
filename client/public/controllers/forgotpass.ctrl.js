/**
 * Created by Tania on 11/25/2015.
 */
angular.module('app').controller("ForgotPassCTRL", function($http, $location){

    var vmodel = this; //Scope of this controller.

    vmodel.sendnotification = function (){

        $http.post('/mvenue-database/forgotpass/', {email: vmodel.email}
        ).then(function successCallback(response){


                window.location.href = "login.html";
            }, function errorCallback(response){

                    alert("There was an internal error. Please try again soon.");
            });
    }

});