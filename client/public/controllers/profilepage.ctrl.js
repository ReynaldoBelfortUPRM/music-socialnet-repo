

angular.module('app').controller("ProfileController", function($http){
    //Object initializations
    var vmodel = this; //The scope of this controller.
    //Array initialization
    vmodel.groupInfo = [];
    vmodel.myTagInfo = [];


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

    //Get data from cookie
    var profileData = $.parseJSON(sessionStorage.getItem('profileData'));

    //GET Basic Info
    $http.get('/mvenue-database/profile/basic-info/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            vmodel.basicInfo = response.data;
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    //GET Tags
    $http.get('/mvenue-database/profile/tag-info/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            vmodel.myTagInfo = response.data;
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    //GET Followers
    $http.get('/mvenue-database/profile/followers/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            vmodel.followersInfo = response.data;
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    //GET Following
    $http.get('/mvenue-database/profile/following/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            vmodel.followingInfo = response.data;
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    //GET Group administrating
    $http.get('/mvenue-database/settings/group-administrating-info/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            //Extend arrar of groups user is involved in
            vmodel.groupInfo.push.apply(vmodel.groupInfo, response.data);
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    //GET Group member
    $http.get('/mvenue-database/settings/group-member-info/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
            //------Recieve and manage response data-------

            //Extend arrar of groups user is involved in
            vmodel.groupInfo.push.apply(vmodel.groupInfo, response.data);
            
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in again!");
                    //Erase current token from the browser cookie
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                }

    });

    var fromCurrentUser = sessionStorage.getItem('fromCurrentUser');

    if(fromCurrentUser){

        //GET Following status
        $http.get('/mvenue-database/settings/follow-status/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            + "&targetID=" + profileData.id.toString()).then(function successCallback(response){
                //------Recieve and manage response data-------

                //Extend arrar of groups user is involved in
                if(response.data.length > 0){
                    
                }
                
            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in again!");
                        //Erase current token from the browser cookie
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data + "\nTry refreshing the page.");
                    }

        });
    }

});

