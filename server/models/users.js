var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  token: String,
  name: String,
  email: String,
  address: String,
  phone: String,
  username: String,
  password: String,
  role: String
});

module.exports = mongoose.model('User', userSchema);
