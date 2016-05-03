var express = require('express'), 
  router = express.Router(),
  passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Show = mongoose.model('Show');

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
      console.log("err");
      res.render('signup',{message:'Your registration information is not valid!'});
    } else {
      console.log("signed in");
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
      req.logIn(user, function(err) {
        res.redirect('/shows');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

//see the shows + data & route handler that calls Show.find
router.get('/shows', function(req, res){
  Show.find(function(err, shows, count){
    res.render('shows', {shows: shows});
  });
});

//add a new show, store info, redirect to shows page
router.get('/shows/add', function(req, res){
  res.render('add');
});
router.post('/shows/add', function(req, res){
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

module.exports = router;
