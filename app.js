var express = require('express');
var app = express();
var path = require("path");
var db = require('./db');
var mongoose = require('mongoose');
var Show = mongoose.model('Show');
var User = mongoose.model('User');

//set up handlebars
app.set('view engine', 'hbs');

//landing page
app.get('/', function(req, res){
  res.render('/main');
});

//if user goes to sign up, store info, redirect to shows page
app.get('/signup', function(req, res){
  res.render('signup');
});
app.post('/signup', function(req, res){
  var username = req.body.name;
  var birthday = req.body.birthday;
  var password = req.body.password; //just used for validation
  var newUser = new User({
    name: username,
    birthDate: birthday
  }).save(function (err, newentry, c){
    res.redirect('/shows');
  });
});

//if the user goes to login
app.get('/login', function(req, res){
  res.render('login');
});
app.post('/login', function(req, res){
  var username = req.body.name;
  var password = req.body.password; //just used for validation
  //if the information is the same as what's store in the database, redirect to shows with current user info
});

//see the shows + data
app.get('/shows', function(req, rest){
  res.render('shows');
});

//add a new show, store info, redirect to shows page
app.get('/shows/add', function(req, res){
  res.render('add');
});
app.post('/shows/add', function(req, res){
  var show = req.body.showTitle;
  var episode = req.body.episodeNumber;
  var length = req.body.episodeLength;
  var newShow = new Show({
    title: show,
    totalNumberOfEpisodesWatched: episode,
    length: averageLengthOfEpisode
  }).save(function(err, newentry, c){
    res.redirect('/shows');
  });
});

//run the express app
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//serve it up
app.listen(3000);
console.log("Server started on port 3000");
