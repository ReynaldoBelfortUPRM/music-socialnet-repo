//Loading required packages:
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
//Load exports from files:
var routes = require('./server/routes/server-routing');
//Main app object
var app = express();

//TODO Necessary condition for some reason
// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'jade');

app.use(logger('dev'));
//TODO Support for POST requests body parsing for sending information.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client', 'public')));
//TODO The  folder containing the /html files must be added as well
app.use(express.static(path.join(__dirname, './client', 'public', 'views')));
//TODO Apply all the routes described in the server-routing.js file to this app on
//the '/' url
app.use('/', routes);

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


module.exports = app;
