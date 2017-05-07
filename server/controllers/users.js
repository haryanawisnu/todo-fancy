var User = require('../models/users');
var jwthelpers = require('../helpers/jwtHelpers');
var passwordHash = require('password-hash');

module.exports = {
  getall: (req, res, next) => {
    User.find()
      .populate('listTodo').exec(function(err, result) {
        if (result) {
          res.json(result);
        } else {
          res.send(`Error get : ${err}`);
        }
      });
  },
  getone: (req, res, next) => {
    User.findOne({
      _id: req.params.id
    }).populate('listTodo').exec(function(err, result) {
      if (result) {
        res.json(result);
      } else {
        res.send(`Error get : ${err}`);
      }
    });
  },
  create: (req, res, next) => {
    User.create({
      id: req.body.id || '',
      token: req.body.token || '',
      username: req.body.username,
      password: passwordHash.generate(req.body.password),
      name: req.body.name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      address: req.body.address || '',
      role: req.body.role
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
        let password;
        if (req.body.password) {
          password = passwordHash.generate(req.body.password);
        } else {
          password = result.password;
        }
        User.update({
          _id: id
        }, {
          $set: {
            username: req.body.username || result.username,
            password: password,
            name: req.body.name || result.name,
            phone: req.body.phone || result.phone,
            address: req.body.address || result.address,
            email: req.body.email || result.email,
            role: req.body.role || result.role,
            token: req.body.token || result.token
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
          token: req.body.token || '',
          username: req.body.username,
          password: passwordHash.generate(req.body.password),
          name: req.body.name || '',
          email: req.body.email || '',
          phone: req.body.phone || '',
          address: req.body.address || '',
          role: req.body.role
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
