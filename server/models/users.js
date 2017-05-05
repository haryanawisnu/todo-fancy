var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var userSchema = mongoose.Schema({
  local: {
    name: String,
    email: String,
    address: String,
    phone: String,
    username: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  }
});

userSchema.methods.generateHash = function(password) {
  return passwordHash.generate(password);
}

userSchema.methods.validPassword = function(password) {
  return passwordHash.verify(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);
