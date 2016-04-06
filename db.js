var mongoose = require('mongoose');

//schemas
var Show = new mongoose.Schema({
  title: String,
  totalNumberOfEpisodesWatched: Number,
  averageLengthOfEpisode: Number
});

var User = new mongoose.Schema({
  name: String,
  birthDate: String
});

mongoose.model('Show', Show);
mongoose.model('User', User);
mongoose.connect('mongodb://localhost/test');
