var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Show = new mongoose.Schema({
  title: {
    type:String, 
    required:[true, 'Show title is required!']
  },
  totalSeasons: {
    type:Number,  
    min:[1, 'The total number of seasons must be greater than 0'],
    required:[true, 'The total number of seasons is required'],
  },
  totalEpisodes: {
    type:Number, 
    min:[1, 'The total number of episodes must be greater than 0'],
    required:[true, 'The total number of episodes is required'],
  },
  epLength: {
    type:Number, 
    min:[1, 'The episode length must be greater than 0'],
    required:[true, 'The episode length is required'],
  },
  netflixPercentage: Number,
  lifePercentage: Number
});

var User = new mongoose.Schema({
  username: {type:String, required:[true, 'Username is required!']},
  password: String,
  birthday: {type:String, required:[true, 'Birthday is required!']},
  shows: [Show],
  userTotal: Number
});

User.plugin(passportLocalMongoose);

mongoose.model('Show', Show);
mongoose.model('User', User);
mongoose.connect(process.env.ORMONGO_URL || 'mongodb://localhost/netflix');
