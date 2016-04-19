var express = require('express');
var app = express();
var path = require("path");
var db = require('./db');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Show = mongoose.model('Show');
var User = mongoose.model('User');
var total = 0;

//bodyParser
app.use(bodyParser.urlencoded({
  extended: false
}));

//set up handlebars
app.set('view engine', 'hbs');

//landing page
app.get('/', function(req, res){
  res.render('main');
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

//see the shows + data & route handler that calls Show.find
app.get('/shows', function(req, res){
  Show.find(function(err, shows, count){
    res.render('shows', {shows: shows});
  });
});

//add a new show, store info, redirect to shows page
app.get('/shows/add', function(req, res){
  res.render('add');
});
app.post('/shows/add', function(req, res){
  total += (req.body.seasonNumber * req.body.episodeNumber * req.body.episodeLength);
  var totalForCurrentShow = req.body.seasonNumber * req.body.episodeNumber * req.body.episodeLength;
  console.log("totalForCurrentShow: " + totalForCurrentShow);
  console.log("total: "+ total);
  var num = (totalForCurrentShow/total) * 100;
  console.log("totalForCurrentShow/total: " + totalForCurrentShow/total);
  var show = req.body.showTitle;
  var seasons = req.body.seasonNumber;
  var episodes = req.body.episodeNumber;
  var length = req.body.episodeLength;

  /*TODO:
  //iterate through all shows and update the percentages, which change once a new show is added
  for(var i=0; i < 'shows'.length; i++){
    show[i].totalForCurrentShow = show[i].body.seasonNumber + show[i].body.episodeNumber + show[i].episodeLength;
    show[i].num = show[i].totalForCurrentShow/total;
  }
  */
  //add a new show to the mongo database 
  var newShow = new Show({
    title: show,
    totalNumberOfSeasonsWatched: seasons,
    totalNumberOfEpisodesPerSeason: episodes,
    averageLengthOfEpisode: length,
    netflixPercentage: num
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
