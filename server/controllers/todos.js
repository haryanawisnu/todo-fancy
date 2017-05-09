var Todo = require('../models/todos');
var User = require('../models/users');
var Job = require('../job/todo');
var mongoose = require('mongoose');
module.exports = {
  getall: (req, res, next) => {
    Todo.find()
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
        status: req.body.status,
        date: req.body.date,
        created: new Date().toISOString(),
        updated: ''
      },
      function(error, result) {
        if (result) {
          let date = req.body.date;
          var temp = {
            time: `00 ${date.slice(14, 16)} ${date.slice(11, 13)} ${date.slice(8, 10)} ${date.slice(5, 7)-1} *`,
            message: req.body.description,
            title: req.body.title
          }
          console.log(temp);
          Job.addCron(temp);
          User.findByIdAndUpdate(req.body.id, {
              $push: {
                listTodo: result
              }
            }, {
              new: true
            })
            .exec((err) => {
              if (err)
                res.send(err)
              else
                res.json(result)
            }) // end exec
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
            date: req.body.date || result.date,
            updated: new Date().toISOString()
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
