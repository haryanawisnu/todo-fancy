var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/users');

router.get('/', usersControllers.getall);

module.exports = router
