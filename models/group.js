var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Group = new Schema({
  host: String,
  guest: String,
  avatarUrl: String,
  groupname: String
})

module.exports = Group
