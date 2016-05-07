var express = require('express'), 
  router = express.Router(),
  passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Show = mongoose.model('Show');

var currentTotal = 0;
var total; //total amount of time spent watching netflix
var loggedIn = false;

//landing page
router.get('/', function(req, res){
  res.render('main');
});

//if user goes to sign up, store info, redirect to shows page
router.get('/signup', function(req, res){
  res.render('signup');
});
router.post('/signup', function(req, res){
  User.register(new User({username:req.body.username, birthday:req.body.birthday, userTotal:'0'}), req.body.password, function(err, user){
    if (err) {
      res.render('signup',{message:'Your registration information is not valid!'});
    } else {
      //if user signs in successfully, automatically signed in
      passport.authenticate('local')(req, res, function() {
        loggedIn = true;
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
  try{
    //determine for how many minutes a user has been alive
    var minutesAlive = minsAlive(req.user.birthday);
    //if logged in, but have no shows
    if (loggedIn && req.user.shows.length === 0){
      console.log("user has logged in but NOT added a show");
      Show.find(function(err, shows, count){
        res.render('shows', {shows: shows});
      });
    }
    //if logged in and have added a show
    else if (loggedIn && req.user.shows.length !== 0){
      var total = req.user.userTotal;
      var percentage = ((total/minutesAlive)).toFixed(10);
      var woo = (currentTotal/total) * 100;
      Show.find(function(err, shows, count){
        res.render('shows', {shows: shows, lifeNetflixPercentage: percentage});
      });
    }
    //if not logged in
    else {
      res.render('login', {message:'You must log in first to see your show stats!'});
    }
  }
  catch(e) {
    res.render('login', {message:'Please log in again.'});
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
//add a new show to the mongo database
router.post('/shows/add', function(req, res){
  var newShow = req.user;
  var minutesAlive = minsAlive(req.user.birthday);
  newShow.userTotal += (parseInt(req.body.seasonNumber) + parseInt(req.body.episodeNumber) + parseInt(req.body.episodeLength));
  //amount watched for current show, not in total
  currentTotal = parseInt(req.body.seasonNumber) + parseInt(req.body.episodeNumber) + parseInt(req.body.episodeLength);
  newShow.shows.push({
    title: req.body.showTitle,
    totalSeasons: req.body.seasonNumber,
    totalEpisodes: req.body.episodeNumber,
    epLength: req.body.episodeLength,
    netflixPercentage: ((currentTotal/newShow.userTotal)*100).toFixed(2),
    lifePercentage: ((currentTotal/minutesAlive) * 100).toFixed(6)
  });
  //UPDATE PREVIOUSLY EXISTING SHOWS, since total amount watched has updated
  //NOTE --> WILL HAVE TO CHANGE LIFE PERCENTAGE IF UPDATE FUNCTIONALITY HAPPENS
  for(var i=0; i < newShow.shows.length-1; i++){
    //re-finding amount watched for current show, not in total
    var current = newShow.shows[i].totalSeasons + newShow.shows[i].totalEpisodes + newShow.shows[i].epLength;
    //recalculate % over updated total
    newShow.shows[i].netflixPercentage = ((current/newShow.userTotal) *100).toFixed(2);
  }
  console.log(newShow.shows);
  newShow.save(function(err, newentry, c){
    res.redirect('/shows');
  });
});

router.get('/update', function(req, res){
  var status= "Update your info for " + req.body.showTitle + "below:"; 
  res.render('shows', {shows: shows, status:status});
});
router.post('/update', function(req, res){
  User.findOne({title:req.user.shows.title}, function(err, updatedShow, count) {
    if (!err) {
      updatedShow.totalSeasons = req.body.seasonNumber;
      updatedShow.totalEpisodes = req.body.episodeNumber;
      updatedShow.epLength = req.body.episodeLength;
      updatedShow.save(function(saveErr, updatedUser, saveCount) {
        res.redirect('/shows');
      });
    } else {
      res.redirect('/update');
    }
  });
});

//visualize page
router.get('/visualize', function(req, res){
  res.render('visualize');
});

function minsAlive(birthday){
  var month = parseInt(birthday.substring(0, 2)) -1;
  var day = parseInt(birthday.substring(2, 4));
  var year = parseInt(birthday.substring(4, 8));
  var oneDay = 24*60*60*1000;
  var formattedBirthday = new Date(year, month, day);
  var today = new Date();
  formattedBirthday.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  var daysAlive = Math.round(Math.abs((formattedBirthday.getTime() - today.getTime())/(oneDay)));
  return daysAlive * 1440;
}
module.exports = router;
