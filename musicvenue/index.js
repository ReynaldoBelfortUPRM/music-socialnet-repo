//---------------Method 1 for static files-------------------
var express = require('express'); 
var path = require('path');
var app = express();
//Express built-in middleware will serve files that are within the specified
//path
app.use(express.static(__dirname + '/www'));
app.use(express.static(__dirname + '/www/views'));

//This code runs when the user enters only the www.musicvenue.me
//It re-diirects that  link to the welcome page.
app.get('/', function(req, res){
	//res.sendFile(__dirname + '/www/views/welcome_page.html');
	res.sendFile(__dirname + '/www/views/welcome_page.html');
	//res.sendFile('welcome_page.html', { root: path.join(__dirname, 'www/views') });
});

app.listen(process.env.PORT || 5000);


//---------------Method 2 for static files-------------------
// var connect = require('connect');
// var serveStatic = require('serve-static');
// onnect().use(serveStatic(__dirname + '/www')).listen(8080);