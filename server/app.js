var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');
var user = require('./controllers/users');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/users');
require('dotenv').config()

mongoose.connect('mongodb://localhost/todofancy');

app.use(bodyParser.urlencoded({
  extended: false
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(user.signin));
passport.use(new FacebookStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function() {
      console.log('next');
      User.findOne({
        id: profile.id
      }, function(err, user) {
        console.log('seac');
        if (err) {
          console.log('err1');
          return done(err);
        } else {
          if (user) {
            console.log('ada');
            return done(null, user);
          } else {
            console.log('creat');
            var newUser = new User();
            newUser.id = profile.id;
            newUser.token = accessToken;
            newUser.username = profile.displayName;
            // newUser.email = profile.emails[0].value;
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            })
            console.log(profile);
          }
        }
      });
    });
  }
));
app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "DELETE,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
  next()
})

app.use('/', index);
app.use('/users', users);
app.use('/todos', todos);

app.listen(3000)
