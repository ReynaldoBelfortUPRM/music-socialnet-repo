$(document).ready(function(){
	$( "#signup" ).click(function() {
	  $("#logincontent").html('<form class="form-signin"> </span><h2>Create your Account</h2> <input type="text" id="inputLastName" class="form-control" placeholder="Name" required autofocus><span id="reauth-email" class="reauth-email"></span> <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required> <input type="password" id="reinputPassword" class="form-control" placeholder="Re-enter your Password" required>                            <br/>   <button class="btn" type="submit">Create your account</button> </form><!-- /form -->');
	

	});

	$( "#forgotpass" ).click(function() {
	  $("#logincontent").html(' <form class="form-signin">    <p id="profile-name" class="profile-name-card"><h2>Enter your email to reset your password</h2></p><span id="reauth-email" class="reauth-email"></span> <input type="email" id="inputEmailfp" class="form-control" placeholder="Email address" required autofocus>       <br/>   <button class="btn" type="submit">Send email</button> </form><!-- /form --> ');
    
	
	});


	$( ".editEventBtn" ).click(function() {
	  $("#administrate_pane").html('<h1>Edit Event</h1>');
		

	});

	$( "#createEvent" ).click(function() {
	  $("#administrate_pane").html('<h1>Create Event</h1>	');
		

	});
	$( "#deleteEvent" ).click(function() {
		/*delete the event in the database*/    

    });



});