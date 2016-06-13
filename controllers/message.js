var db = require('../models')

exports.create = function(message, callback) {
  var temp = message
  var message = new db.Message
  message.message = temp.message
  message.creator = temp.creator
  message.save(callback)
}

exports.read = function(callback) {
  db.Message.find({}, null, {
    sort: {
      'createAt': -1
    },
    limit: 20
  }, callback)
}
