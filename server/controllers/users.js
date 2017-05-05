var User = require('../models/users');
var passwordHash = require('password-hash');
var jwthelpers = require('../helpers/jwtHelpers');

module.exports = {
  getall: (req, res, next) => {
    User.find().exec(function(err, result) {
      if (result) {
        res.json(result);
      } else {
        res.send(`ERR getall :\n ${err}`);
      }
    });
  },
  create: (req, res, next) => {
    User.create({
      name: req.body.name,
      username: req.body.username,
      password: passwordHash.generate(req.body.password),
      role: req.body.role
    }, function(error, result) {
      if (result) {
        res.json(result);
      } else {
        res.send(`ERR input :\n ${error}`);
      }
    });
  },
  delete: (req, res, next) => {
    let id = req.params.id;
    User.remove({
      _id: id
    }, function(err) {
      if (!err) {
        res.send(`Success remove with id ${id}`);
      } else {
        res.send(`ERR input :\n ${error}`);
      }
    });
  },
  update: (req, res, next) => {
    let id = req.params.id;
    User.findOne({
      _id: id
    }).exec(function(err, result) {
      if (result) {
        User.update({
          _id: id
        }, {
          $set: {
            name: req.body.name || result.name,
            username: req.body.username || result.username,
            password: passwordHash.generate(req.body.password) || result.password,
            role: req.body.role || result.role
          }
        }, function(err, result) {
          if (result) {
            res.json(result);
          } else {
            res.send(`ERR Update :\n ${err}`);
          }
        });
      } else {
        res.send(`ERR getall :\n ${err}`);
      }
    });
  },
  signup: (req, res, next) => {
    User.create({
      name: req.body.name,
      username: req.body.username,
      password: passwordHash.generate(req.body.password),
      role: req.body.role
    }, function(error, result) {
      if (result) {
        res.json(result);
      } else {
        res.send(`ERR input :\n ${error}`);
      }
    });
  },
  signin: (username, password, cb) => {
    User.findOne({
      username: username
    }).exec(function(err, result) {
      if (!result) {
        cb({
          success: false,
          message: 'Authentication failed. User not found.',
          error: err
        });
      } else if (result) {
        if (passwordHash.verify(password, result.password)) {
          cb(null, {
            success: true,
            message: 'Enjoy your token!',
            token: jwthelpers.sign(result)
          });
        } else {
          cb({
            success: false,
            message: 'Authentication failed. Password Wrong.',
            error: err
          });
        }
      }
    })
  }
}
