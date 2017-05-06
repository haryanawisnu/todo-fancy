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

require('dotenv').config()

mongoose.connect('mongodb://localhost/todo-fancy');

app.use(bodyParser.urlencoded({
  extended: false
}));

passport.use(new LocalStrategy(user.signin));

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
  next()
})

app.use('/', index);
app.use('/users', users);
app.use('/todos', todos);

app.listen(3000)
