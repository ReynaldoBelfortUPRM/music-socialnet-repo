
//var cool = require('cool-ascii-faces');
//var express = require('express');
//var app = express();

//app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index')
// });



// app.get('/cool', function(request, response) {
//   response.send(cool());
// });

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

//---------------Method 1 for static files-------------------
var express = require('express'); 
var app = express();
app.use(express.static(__dirname + '/www'));

app.listen(process.env.PORT || 5000);


//---------------Method 2 for static files-------------------
// var connect = require('connect');
// var serveStatic = require('serve-static');
// onnect().use(serveStatic(__dirname + '/www')).listen(8080);