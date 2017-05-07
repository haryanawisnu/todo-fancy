var express = require('express');
var router = express.Router();
var User = require('../controllers/users');
var passport = require('passport');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
router.post('/signup', User.signup);
router.post('/signin', passport.authenticate('local', {
  session: false
}), function(req, res) {
  var user = req.user;
  res.json(user);
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false
  }));
module.exports = router
