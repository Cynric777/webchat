var db = require('../models')

exports.create = function(message, callback) {
  var temp = message
  var message = new db.Message
  message.message = temp.message
  message.sender = temp.sender
  message.receiver = temp.receiver
  message.avatarUrl = temp.avatarUrl
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

exports.findMessageByPair = function(host, guest, callback) {
  db.Message.find({
    $or: [
      {
        sender: host,
        receiver: guest
      },
      {
        sender: guest,
        receiver: host
      }
    ]
  }, null, {
    sort: {
      'createAt': 1
    },
    limit: 20
  }, callback)
}
