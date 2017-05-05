var express = require('express');
var router = express.Router();
var User = require('../controllers/users');
var passport = require('passport');

router.get('/', function(req, res) {
  res.send('login', {
    message: req.flash('loginMessage')
  });
});
router.post('/signup', passport.authenticate('local-signup', {
  session: false
}));
module.exports = router
