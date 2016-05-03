var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

//schemas
var Show = new mongoose.Schema({
  title: String,
  totalNumberOfSeasonsWatched: Number,
  totalNumberOfEpisodesPerSeason: Number,
  averageLengthOfEpisode: Number,
  netflixPercentage: Number
});

var User = new mongoose.Schema({
  username: String,
  password: String,
  birthday: String
});

User.plugin(passportLocalMongoose);

mongoose.model('Show', Show);
mongoose.model('User', User);
mongoose.connect('mongodb://localhost/netflix');
