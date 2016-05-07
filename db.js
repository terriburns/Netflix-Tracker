var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Show = new mongoose.Schema({
  title: String,
  totalSeasons: Number,
  totalEpisodes: Number,
  epLength: Number,
  netflixPercentage: Number,
  lifePercentage: Number
});

var User = new mongoose.Schema({
  username: String,
  password: String,
  birthday: String,
  shows: [Show],
  userTotal: Number
});


var Total = new mongoose.Schema({
  totalValue: Number
});

User.plugin(passportLocalMongoose);

mongoose.model('Show', Show);
mongoose.model('User', User);
mongoose.connect('mongodb://localhost/netflix');
