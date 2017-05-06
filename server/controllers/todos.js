var Todo = require('../models/todos');
module.exports = {
  getall: (req, res, next) => {
    Todo.find()
      .populate('user')
      .exec(function(err, result) {
        if (result) {
          res.json(result);
        } else {
          res.send(`Error getall :\n ${err}`);
        }
      });
  },
  create: (req, res, next) => {
    Todo.create({
        title: req.body.title,
        description: req.body.description,
        user: req.body.user,
        status: false,
        created: new Date().toISOString(),
        updated: ''
      },
      function(error, result) {
        if (result) {
          res.json(result);
        } else {
          res.send(`Error input :\n ${error}`);
        }
      });
  },
  delete: (req, res, next) => {
    let id = req.params.id;
    Todo.remove({
      _id: id
    }, function(err) {
      if (!err) {
        res.send(`Success remove with id ${id}`);
      } else {
        res.send(`Error remove :\n ${error}`);
      }
    });
  },
  update: (req, res, next) => {
    let id = req.params.id;
    Todo.findOne({
      _id: id
    }).exec(function(err, result) {
      if (result) {
        Todo.update({
          _id: id
        }, {
          $set: {
            title: req.body.title || result.title,
            description: req.body.description || result.description,
            status: req.body.status || result.status,
            user: req.body.user || result.user,
            updated: new Date().toISOString(),
          }
        }, function(err, result) {
          if (result) {
            res.json(result);
          } else {
            res.send(`Error Update :\n ${err}`);
          }
        });
      } else {
        res.send(`Error getall :\n ${err}`);
      }
    });
  }
}
