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
//var minutesAlive; //the number of days a user has lived

//landing page
router.get('/', function(req, res){
  res.render('main');
});

//if user goes to sign up, store info, redirect to shows page
router.get('/signup', function(req, res){
  res.render('signup');
});
router.post('/signup', function(req, res){
  User.register(new User({username:req.body.username}), req.body.password, function(err, user){
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
      function minutesUserAlive(){
        //determine for how many minutes a user has been alive
        var birthday = req.body.birthday;
        var month = parseInt(birthday.substring(0, 2)) -1;
        var day = parseInt(birthday.substring(2, 4));
        var year = parseInt(birthday.substring(4, 8));
        var oneDay = 24*60*60*1000;
        var formattedBirthday = new Date(year, month, day);
        var today = new Date();
        formattedBirthday.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        var daysAlive = Math.round(Math.abs((formattedBirthday.getTime() - today.getTime())/(oneDay)));
        var minutesAlive = daysAlive * 1440;
        return minutesAlive;
      }
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
    var minutesAlive = minutesUserAlive();
    var percentage = ((total/minutesAlive)).toFixed(6);
    var woo = (totalForCurrentShow/total) * 100;
    console.log("--------------------------");
    console.log("minutesAlive: " + minutesAlive);
    console.log("percentage: " + percentage);
    console.log("woo: " + woo);
    console.log("--------------------------");
    Show.find(function(err, shows, count){
      res.render('shows', {shows: shows, lifeNetflixPercentage: percentage});
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
  var num = ((totalForCurrentShow/total) * 100).toFixed(2);
  var life = ((totalForCurrentShow/minutesAlive) * 100).toFixed(6);
  console.log("totalForCurrentShow/total: " + totalForCurrentShow/total);
  haveAddedShow = true;
  /*
    Show.find({}, function(err, shows, count){
     shows.totalNumberOfSeasonsWatched= req.body.seasonNumber;
     shows.totalNumberOfEpisodesPerSeason= req.body.episodeNumber;
     shows.averageLengthOfEpisode= req.body.episodeLength;
     var pastTotal = update.totalNumberOfSeasonsWatched * update.totalNumberOfEpisodesPerSeason * update.averageLengthOfEpisode;
     shows.netflixPercentage = (pastTotal/total);
     shows.lifePercentage = (pastTotal/minutesAlive);
     shows.save(function(saveErr, updatedUser, saveCount) {
     res.redirect('/shows');
     });
     } else {
     res.redirect('/shows');
     }
     });
     */
  //add a new show to the mongo database 
  var newShow = new Show({
    title: req.body.showTitle,
    totalNumberOfSeasonsWatched: req.body.seasonNumber,
    totalNumberOfEpisodesPerSeason: req.body.episodeNumber,
    averageLengthOfEpisode: req.body.episodeLength,
    netflixPercentage: num,
    lifePercentage: life
  }).save(function(err, newentry, c){
    res.redirect('/shows');
  });
});

router.get('/update', function(req, res){
    Show.find({title: req.query.showTitle}, function(err, shows, count){
      var status= "Ypdate your info for " + req.body.showTitle + "below:"; 
      res.render('shows', {shows: shows, status:status});
    });
  res.render('update');
});

//visualize page
router.get('/visualize', function(req, res){
  res.render('visualize');
});

module.exports = router;
