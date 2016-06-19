var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

var Message = new Schema({
  message: String,
  sender: String,
  receiver: String,
  avatarUrl: String,
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = Message
