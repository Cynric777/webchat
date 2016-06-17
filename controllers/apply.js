var db = require('../models')

exports.createApply = function(host, guest, callback) {
  apply = new db.Apply
  apply.host = host
  apply.guest = guest
  apply.read = false
  apply.result = false
  apply.save(callback)
}

exports.findApplyByHost = function(host, callback) {
  db.Apply.find({
    host: host,
    read: false
  }, callback)
}

exports.handleApply = function(id, result, callback){
  db.Apply.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      read: true,
      result: result
    }
  }, callback)
}
