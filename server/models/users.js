var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = mongoose.Schema({
  id: String,
  token: String,
  name: String,
  email: String,
  address: String,
  phone: String,
  username: String,
  password: String,
  role: String,
  listTodo: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }]
});

module.exports = mongoose.model('User', userSchema);
