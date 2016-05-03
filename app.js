require('./db');
require('./auth');
var express = require('express');
var path = require("path");
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var Show = mongoose.model('Show');
var User = mongoose.model('User');

var app = express();
var total = 0;

//session support so that a user can remain logged in
var session = require('express-session');
var sessionOptions = {
  secret: 'secret cookie thang (store this elsewhere!)',
  resave: true,
  saveUninitialized: true
};
app.use(session(sessionOptions));

//engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//initialize passport and let it know that we're enabling sessions
app.use(passport.initialize());
app.use(passport.session());

//drop req.user into the context of every template
app.use(function(req, res, next){
    res.locals.user = req.user;
      next();
});

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

//serve it up
app.listen(3000);
console.log("Server started on port 3000");
