angular.module('app').controller("RegisterControl", function($http){

    var vmodel = this; //Scope of this controller.


    // $http.get('/mvenue-database/register/').success(function(data){
    //       vmodel.uusers=data;
    // });

    //vmodel.add = function (event){
    //    if(event.keyCode==13){
    //        $http.post('/mvenue-database/register/', {text: vmodel.inputname}).success(function(dbData){
    //            vmodel.uusers = dbData;
    //        });
    //
    //    }
    //
    //};
    vmodel.signin = function (event){
        if(event.keyCode==13){
            console.log("antes");
            $http.post('/mvenue-database/register/', {text: vmodel.inputname}).success(function(dbData){
                vmodel.uusers = dbData;
            });

            console.log("despues");
        }
    };

});