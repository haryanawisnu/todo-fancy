var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/users');

router.get('/', usersControllers.getall);
router.get('/:id', usersControllers.getone);
router.post('/', usersControllers.create);
router.delete('/:id', usersControllers.delete);
router.put('/:id', usersControllers.update);

module.exports = router
