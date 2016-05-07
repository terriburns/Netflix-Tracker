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
      res.render('signup',{message:'Your registration information is not valid!', err:err});
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
  if (newShow !== undefined) {
    var minutesAlive = minsAlive(req.user.birthday);
    newShow.userTotal += (parseInt(req.body.seasonNumber) * parseInt(req.body.episodeNumber) * parseInt(req.body.episodeLength));
    console.log("/shows/add total: " + newShow.userTotal);
    //amount watched for current show, not in total
    currentTotal = parseInt(req.body.seasonNumber) * parseInt(req.body.episodeNumber) * parseInt(req.body.episodeLength);
    newShow.shows.push({
      title: req.body.showTitle,
      totalSeasons: req.body.seasonNumber,
      totalEpisodes: req.body.episodeNumber,
      epLength: req.body.episodeLength,
      netflixPercentage: ((currentTotal/newShow.userTotal)*100).toFixed(2),
      lifePercentage: ((currentTotal/minutesAlive) * 100).toFixed(6)
    });
    //UPDATE PREVIOUSLY EXISTING SHOWS, since total amount watched has updated
    for(var i=0; i < newShow.shows.length-1; i++){
      //re-finding amount watched for current show, not in total
      var current = newShow.shows[i].totalSeasons * newShow.shows[i].totalEpisodes * newShow.shows[i].epLength;
      //recalculate % over updated total
      console.log(current);
      newShow.shows[i].netflixPercentage = ((current/newShow.userTotal) *100).toFixed(2);
    }
    console.log(newShow.shows);
    newShow.save(function(err){
      if(err){
        console.log("it got here");
        //remove that show if it had errors
        var lastShowAdded = (newShow.shows.length) -1;
        newShow.shows[lastShowAdded].remove();
        console.log(newShow.shows);
        res.render('add', {err:err});
      }else{
        res.render('shows');
      }
    });
  }
  else {
    res.render('login', {message:'Please log in again.'});
  }
});

//remove page
router.get('/remove', function(req, res){
  res.render('remove');
});
router.post('/remove', function(req, res){
  var updateShow = req.user;
  console.log("user: " + updateShow);
  //if the user opted to delete a show, locate and remove the requested show
  for(var i=0; i < updateShow.shows.length; i++){
    if(updateShow.shows[i].title === req.body.removeShow){
      var removeAmount = (updateShow.shows[i].totalSeasons * updateShow.shows[i].totalEpisodes * updateShow.shows[i].epLength);
      updateShow.shows[i].remove();
      //update the total amount of netflix watched
      updateShow.userTotal -= removeAmount;
    }
  }
  //update remaining shows since total has changed
  for(var j=0; j < updateShow.shows.length; j++){
    //re-finding amount watched for current show, not in total
    var current = updateShow.shows[j].totalSeasons * updateShow.shows[j].totalEpisodes * updateShow.shows[j].epLength;
    //recalculate % over updated total
    updateShow.shows[j].netflixPercentage = ((current/updateShow.userTotal) *100).toFixed(2);
  }
  updateShow.save(function(err){
    if(!err){
      console.log(updateShow.shows);
      res.redirect('/shows');
    }
    else{
      console.log("problem");
    }
  });
});

//update page
router.get('/update', function(req, res){
  res.render('update');
});
router.post('/update', function(req, res){
  var updateShow = req.user;
  for(var i=0; i < updateShow.shows.length; i++){
    if(updateShow.shows[i].title === req.body.showTitle){
      //first, remove the amount of time this show contributed to "total"
      var removeAmount = (updateShow.shows[i].totalSeasons * updateShow.shows[i].totalEpisodes * updateShow.shows[i].epLength);
      updateShow.userTotal -=removeAmount;

      //then, update the values for said show
      if(req.body.seasonNumber !== null){
        updateShow.shows[i].totalSeasons = req.body.seasonNumber;
      }
      if(req.body.episodeNumber !== null){
        updateShow.shows[i].totalEpisodes = req.body.episodeNumber;
      }
      if(req.body.episodeLength !== null){
        updateShow.shows[i].epLength = req.body.episodeLength;
      }

      //then, recalculate the total and netflixPercentage
      var addAmount = (updateShow.shows[i].totalSeasons * updateShow.shows[i].totalEpisodes * updateShow.shows[i].epLength); //these values have updated
      updateShow.userTotal += addAmount;
      updateShow.shows[i].netflixPercentage = ((addAmount/updateShow.userTotal) *100).toFixed(2); //recalculate % over updated total
    }
  }
  //finally, update the values for all the other shows with the newly updated total
  for(var j=0; j < updateShow.shows.length; j++){
    //re-finding amount watched for current show, not in total
    var current = updateShow.shows[j].totalSeasons * updateShow.shows[j].totalEpisodes * updateShow.shows[j].epLength;
    //recalculate % over updated total
    updateShow.shows[j].netflixPercentage = ((current/updateShow.userTotal) *100).toFixed(2);
  }
  updateShow.save(function(err){
    if(!err){
      console.log(updateShow.shows);
      res.redirect('/shows');
    }
    else{
      console.log("problem");
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
