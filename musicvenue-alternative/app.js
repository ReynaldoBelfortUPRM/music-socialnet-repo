var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//DB------------------------------------------------------------------------

var pg = require("pg");

var conString = "pg://nhtxclclofbeab:K9eQnPqG_yWOgquFHw9PkfhmhX@ec2-54-163-228-188.compute-1.amazonaws.com:5432/d1jo4i2pnj1en2";

conString={
  user: "nhtxclclofbeab",
  password: "K9eQnPqG_yWOgquFHw9PkfhmhX",
  database: "d1jo4i2pnj1en2",
  port: 5432,
  host: "ec2-54-163-228-188.compute-1.amazonaws.com",
  ssl: true
};
var client = new pg.Client(conString);
client.connect();


//client.query("INSERT INTO uuser(first_name, last_name, email, password, photo_path, about) VALUES ($1, $2,$3, $4,$5, $6)",
//    ['metraco','fernandez','asdads@adads.com','asasd','http://www.clearwater.org/wp-content/uploads/2015/02/christmas-music-notes-border-singing_8355-1.jpg','about']
//);
//"INSERT INTO uuser(first_name, last_name, email, password, photo_path, about) VALUES ($1, $2,$3, $4,$5, $6)",
//['metraco','fernandez','asdads@adads.com','asasd','http://www.clearwater.org/wp-content/uploads/2015/02/christmas-music-notes-border-singing_8355-1.jpg','about']



 client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");
 client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
 client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);

var query = client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");
query.on("row", function (row, result) {
  result.addRow(row);
});
query.on("end", function (result) {
  //console.log(JSON.stringify(result.rows, null, "    "));
  client.end();
});
//DB--------------------------------------------------------------------------

module.exports = app;
