var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var todoSchema = new Schema({
  title: String,
  description: String,
  status: Boolean,
  created: Date,
  updated: Date,
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});
var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
