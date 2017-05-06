var express = require('express');
var router = express.Router();
var User = require('../controllers/users');
var passport = require('passport');

router.get('/', function(req, res) {
  res.send('login');
});
router.post('/signup', User.signup);
module.exports = router
