var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Apply = new Schema({
  host: String,
  guest: String,
  sponsor: Boolean,
  read: Boolean,
  result: Boolean
})

module.exports = Apply
