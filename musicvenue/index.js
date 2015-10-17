//---------------Method 1 for static files-------------------
var express = require('express'); 
var app = express();
app.use(express.static(__dirname + '/www'));

//This code runs when the user enters only the www.musicvenue.me
//It re-diirects that  link to the welcome page.
app.get('/', function(req, res){
	res.sendFile(__dirname + '/www/welcome_page.html');
	//res.sendFile(path.join(__dirname, '../www', 'welcome_page.html'));
});

app.listen(process.env.PORT || 5000);


//---------------Method 2 for static files-------------------
// var connect = require('connect');
// var serveStatic = require('serve-static');
// onnect().use(serveStatic(__dirname + '/www')).listen(8080);