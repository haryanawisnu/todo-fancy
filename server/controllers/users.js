var User = require('../models/users');
var jwthelpers = require('../helpers/jwtHelpers');
var passwordHash = require('password-hash');

module.exports = {
  getall: (req, res, next) => {
    User.find().exec(function(err, result) {
      if (result) {
        res.json(result);
      } else {
        res.send(`Error get : ${err}`);
      }
    });
  },
  create: (req, res, next) => {
    User.create({
      'local.username': req.body.username,
      'local.password': passwordHash.generate(req.body.password),
      'local.name': req.body.name,
      'local.email': req.body.email,
      'local.phone': req.body.phone,
      'local.address': req.body.address,
      'local.role': req.body.role
    }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.send(`Error create : ${error}`);
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
        res.send(`Error remove with id ${id}`);
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
            username: req.body.username || result.username,
            password: passwordHash.generate(req.body.password) || result.password,
            name: req.body.name || result.name,
            name: req.body.phone || result.phone,
            name: req.body.address || result.address,
            name: req.body.email || result.name,
            role: req.body.role || result.role
          }
        }, function(err, result) {
          if (result) {
            res.send(result);
          } else {
            res.send(`Error update : ${err}`);
          }
        });
      } else {
        res.send(`Error findupdate : ${err}`);
      }
    });
  },
  signup: (req, res, next) => {
    User.findOne({
      'local.username': req.body.username
    }).exec(function(err, result) {
      if (!result) {
        User.create({
          'local.username': req.body.username,
          'local.password': passwordHash.generate(req.body.password),
          'local.name': req.body.name,
          'local.email': req.body.email,
          'local.phone': req.body.phone,
          'local.address': req.body.address,
          'local.role': req.body.role
        }, function(error, result) {
          if (result) {
            res.send(result);
          } else {
            res.send(`Error signup : ${error}`);
          }
        });
      } else if (result) {
        res.send(`Username already exist`);
      }
    })
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
