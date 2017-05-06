var express = require('express');
var router = express.Router();
var todosControllers = require('../controllers/todos');

router.get('/', todosControllers.getall);
router.post('/', todosControllers.create);
router.delete('/:id', todosControllers.delete);
router.put('/:id', todosControllers.update);

module.exports = router
