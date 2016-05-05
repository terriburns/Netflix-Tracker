var express = require('express'), 
  router = express.Router(),
  passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Show = mongoose.model('Show');

var totalForCurrentShow = 0;
var total = 0; //total amount of time spent watching netflix
var haveAddedShow = false;
var loggedIn = false;
var minutesAlive = 1000000; //the number of days a user has lived

//landing page
router.get('/', function(req, res){
  res.render('main');
});

//if user goes to sign up, store info, redirect to shows page
router.get('/signup', function(req, res){
  res.render('signup');
});
router.post('/signup', function(req, res){
  User.register(new User({username:req.body.username}),
                req.body.password, function(err, user){
                  if (err) {
                    res.render('signup',{message:'Your registration information is not valid!'});
                  } else {
                    //if user signs in successfully, automatically signed in
                    passport.authenticate('local')(req, res, function() {
                      res.redirect('/shows');
                    });
                  }
                });
});

//if the user goes to login
router.get('/login', function(req, res){
  res.render('login');
});
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      loggedIn = true;
      req.logIn(user, function(err) {
        res.redirect('/shows');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect. Have you signed up?'});
    }
  })(req, res, next);
});

//logout
router.get('/logout', function(req, res) {
  req.logOut();
  res.redirect('/');
});

//see the shows + data & route handler that calls Show.find
router.get('/shows', function(req, res){
  //if logged in, but have no shows
  if (loggedIn && haveAddedShow === false){
    console.log("user has logged in but NOT added a show");
    Show.find(function(err, shows, count){
      res.render('shows', {shows: shows});
    });
  }
  //if logged in and have added a show
  else if (loggedIn && haveAddedShow){
    console.log("user is logged in and has already added a show");
    console.log("total: " + total);
    console.log("totalForCurrentShow: " + totalForCurrentShow);
    var percentage = (total/minutesAlive);
    var woo = (totalForCurrentShow/total) * 100;
    console.log("percentage: " + percentage);
    console.log("woo: " + woo);
    Show.find(function(err, shows, count){
      res.render('shows', {shows: shows, lifeNetflixPercentage: percentage, netflixPerc: woo});
    });
  }
  //if not logged in
  else {
    res.render('login', {message:'You must log in first to see your show stats!'});
  }
});

//add a new show, store info, redirect to shows page
router.get('/shows/add', function(req, res){
  if (loggedIn){
    res.render('add');
  }
  else{
    res.render('login', {message:'You must log in first to add a show!'});
  }
});
router.post('/shows/add', function(req, res){
  total += (req.body.seasonNumber * req.body.episodeNumber * req.body.episodeLength);
  totalForCurrentShow = req.body.seasonNumber * req.body.episodeNumber * req.body.episodeLength;
  console.log("totalForCurrentShow: " + totalForCurrentShow);
  console.log("total: "+ total);
  var num = (totalForCurrentShow/total) * 100;
  console.log("totalForCurrentShow/total: " + totalForCurrentShow/total);
  var show = req.body.showTitle;
  var seasons = req.body.seasonNumber;
  var episodes = req.body.episodeNumber;
  var length = req.body.episodeLength;
  haveAddedShow = true;
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

module.exports = router;
