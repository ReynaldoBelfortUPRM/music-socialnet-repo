//AngularJS controller
angular.module('app').controller("SettingsController", function($http){
    //Initializations
	var vmodel = this; //The scope of this controller
    vmodel.newTagData = "";
    vmodel.btnBasicInfoEnabled = true;
    vmodel.passData = {};
    vmodel.passData.currentPass = "";
    vmodel.passData.newPass = "";
    vmodel.passData.confirmNewPass = "";

    //-----------Client-Server interaction--------------
    //TODO Verify if the user is logged in first!
    //TODO The below code must exist on every other page that requires a logged user

    //Verify the existace ofa token. In other words, if a user is logged in.
	if(sessionStorage.getItem('clientAuthentication') === undefined || sessionStorage.getItem('clientAuthentication') === null){
		window.location.href = "index.html";
	}

	//------Event handlers-------
    vmodel.textChanged = function(){
        if(vmodel.btnBasicInfoEnabled){
            vmodel.btnBasicInfoEnabled = !vmodel.btnBasicInfoEnabled;
        }
    };

     vmodel.saveBasicInfo = function(){
        //Save the basic info into the database:

        //EDIT/UPDATE for Basic info
        $http.post('/mvenue-database/settings/basic-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            , vmodel.basicInfo).then(function successCallback(response){
                //Update succesful, disable button and alert user
                vmodel.btnBasicInfoEnabled = true;
                alert("Update successful!");
                //Update user name on the client's session object
                var updatedSession = sessionStorage.getItem('clientAuthentication');
                updatedSession.userName = basicInfo.first_name + " " + basicInfo.last_name;
                sessionStorage.setItem('clientAuthentication', JSON.stringify(updatedSession));

            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });

    };

    vmodel.saveNewPass = function(){
        if(vmodel.passData.newPass == vmodel.passData.confirmNewPass){
        
            //Verify current password and update new password in the database
            $http.post('/mvenue-database/settings/password-reset/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
                , {currentPass: vmodel.passData.currentPass, newPass: vmodel.passData.newPass}).then(function successCallback(response){
                    //Succesful password change
                    alert("Your password was updated successfully!");
                    //Clear text fields:
                    vmodel.passData.currentPass = "";
                    vmodel.passData.newPass = "";
                    vmodel.passData.confirmNewPass = "";

                }, function errorCallback(response){
                        if(response.status == 401){
                            alert("Authentication error! Your session may have been expired. Please log-in!");
                            //Erase current token
                            sessionStorage.removeItem('clientAuthentication');
                            //Re-direct user to the log-in page
                            window.location.href = "login.html";
                        } else if(response.status == 402){
                            alert("Error: " + response.data.message + " Please try again!");

                        } else{
                            alert("Server Internal Error: " + response.data);
                        }

                });
        } else {
            alert("Passwords don't match! Please try again!");
        }

    };

    vmodel.addTag = function(){
        
        if(vmodel.newTagData.length > 0){
            //Update tag in the database
            $http.post('/mvenue-database/settings/tag-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
                , {data: vmodel.newTagData}).then(function successCallback(response){
                    //Succesful response

                    //Erase text field
                    vmodel.newTagData = "";

                    //Reload tag data:
                    vmodel.tagInfo = response.data;

                }, function errorCallback(response){
                        if(response.status == 401){
                            alert("Authentication error! Your session may have been expired. Please log-in!");
                            //Erase current token
                            sessionStorage.removeItem('clientAuthentication');
                            //Re-direct user to the log-in page
                            window.location.href = "login.html";
                        }
                        else{
                            alert("Server Internal Error: " + response.data);
                        }

                });
        }
    };

    vmodel.saveTag = function(tag){
        //Update tag in the database
        $http.put('/mvenue-database/settings/tag-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            , tag).then(function successCallback(response){
                //Alert user of the succes of the request
                alert("Update successful!");

            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });
    };

    vmodel.removeTag = function(tag){
        //Remove tag on the database
        $http.delete('/mvenue-database/settings/tag-info/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            + "&tagID="+ tag.tag_id.toString()).then(function successCallback(response){
                //Succesful request. Refresh tags on view
                vmodel.tagInfo = response.data;
                
            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });
    };

    //-----Admin group-----

    vmodel.showModalAddGroup = function(){
        //Show modal dialog to add a new group
        $('#modalAddAdminGroup').modal('show');
    };

    vmodel.addAdminGroup = function(newAdminGroup){
        //In case of no photo
        newAdminGroup.photo_path = "";

        //Add group into the database
        if(newAdminGroup.name.length > 0){
            //Update tag in the database
            $http.post('/mvenue-database/settings/new-group/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
                , newAdminGroup).then(function successCallback(response){
                    //Succesful response

                    //Erase edit data and hide modal.
                    vmodel.clearModal();
                    $('#modalAddAdminGroup').modal('hide');

                    //Reload admin group data:
                    vmodel.adminGroupInfo = response.data;

                }, function errorCallback(response){
                        if(response.status == 401){
                            alert("Authentication error! Your session may have been expired. Please log-in!");
                            //Erase current token
                            sessionStorage.removeItem('clientAuthentication');
                            //Re-direct user to the log-in page
                            window.location.href = "login.html";
                        }
                        else{
                            alert("Server Internal Error: " + response.data);
                        }

                });
        }
    };


    vmodel.saveAdminGroup = function(adminGroup){
        //Update tag in the database
        $http.put('/mvenue-database/settings/update-group/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            , adminGroup).then(function successCallback(response){
                //Alert user of the succes of the request
                alert("Update successful!");

                //Erase edit data and hide modal.
                vmodel.clearModal();
                $('#modalEditGroup').modal('hide');

            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });
    };

    vmodel.deleteAdminGroup = function(targetGroup){
        //Remove group from the database
        $http.delete('/mvenue-database/settings/delete-admin-group/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            + "&groupID="+ targetGroup.group_id.toString()).then(function successCallback(response){
                //Succesful request. Refresh groups on view
                vmodel.adminGroupInfo = response.data;
                
            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });
    };

    vmodel.supplyAdminEditModal = function(adminGroup){
        //Bind the data from the selected post into the edit modal
        vmodel.editData = adminGroup;
        //Show modal
        $('#modalEditGroup').modal('show');
    };

    //Function needed in case the user closes the modal without saving any changes.
    vmodel.clearModal = function(){
        vmodel.editData = null;
        vmodel.addGroupData = null;
    };

    //-----Member group-----
    vmodel.deleteMemberGroup = function(memberGroup){
        //Remove group from the database
        $http.delete('/mvenue-database/settings/delete-member-group/?tk=' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            + "&groupID="+ targetGroup.group_id.toString()).then(function successCallback(response){
                //Succesful request. Refresh groups on view
                vmodel.adminGroupInfo = response.data;
                
            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }

            });
    };

    vmodel.deleteUserAccount = function(){
        var proceed = confirm("Are you really sure you want to delete your account?");

        if(proceed){
            //TODO Proceed to delete the user account
            $http.delete('/mvenue-database/settings/user/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
            ).then(function successCallback(response){
                //Succesful request. //Re-direct client to the homepage
                window.location.href = "login.html";
                
            }, function errorCallback(response){
                    if(response.status == 401){
                        alert("Authentication error! Your session may have been expired. Please log-in!");
                        //Erase current token
                        sessionStorage.removeItem('clientAuthentication');
                        //Re-direct user to the log-in page
                        window.location.href = "login.html";
                    }
                    else{
                        alert("Server Internal Error: " + response.data);
                    }
                    
                });
        }

    };

	vmodel.changeUserMode = function(){

		$http.get('/mvenue-database/changeUserMode/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        , {targetID: 0, userName: "TODO"}).then(function successCallback(response){
        	//------Successful change of user mode-------

            //Replace current clientAuthentication object with a new one
            sessionStorage.setItem('clientAuthentication', JSON.stringify(response.data));

            alert("Now you are set as: " + response.data.userName);

            //Refresh page so that the User Name get's refreshed as well
            window.location.reload();

        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                	//Could not change user mode for some reason:
                    alert("Server Internal Error: " + response.data);
                }

        });
	};

    //GET for loading BASIC INFO
    $http.get('/mvenue-database/settings/basic-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        ).then(function successCallback(response){

            //Load object coming from server
            vmodel.basicInfo = response.data;
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data);
                }

        });

    //GET for loading user TAGS
    $http.get('/mvenue-database/settings/tag-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        ).then(function successCallback(response){

            //Load object coming from server
            vmodel.tagInfo = response.data;
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data);
                }

        });

    //GET for loading Groups that user administrates
    $http.get('/mvenue-database/settings/group-administrating-info/' + $.parseJSON(sessionStorage.getItem('clientAuthentication')).token
        ).then(function successCallback(response){

            //Load object coming from server
            vmodel.adminGroupInfo = response.data;
        }, function errorCallback(response){
                if(response.status == 401){
                    alert("Authentication error! Your session may have been expired. Please log-in!");
                    //Erase current token
                    sessionStorage.removeItem('clientAuthentication');
                    //Re-direct user to the log-in page
                    window.location.href = "login.html";
                }
                else{
                    alert("Server Internal Error: " + response.data);
                }

        });
    
});//End angular controller