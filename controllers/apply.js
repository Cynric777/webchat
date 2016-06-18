var db = require('../models')

exports.createApply = function(host, guest, callback) {
  apply = new db.Apply
  apply.host = host
  apply.guest = guest
  apply.sponsor = false
  apply.read = false
  apply.result = false
  apply.save(callback)
}

exports.createApproval = function(approval, callback) {
  apply = new db.Apply
  apply.host = approval.guest
  apply.guest = approval.host
  apply.sponsor = true
  apply.read = false
  apply.result = approval.result
  apply.save(callback)
}

exports.findApplyByHost = function(host, callback) {
  db.Apply.find({
    host: host,
    read: false
  }, callback)
}

exports.handle = function(id, callback){
  db.Apply.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      read: true
    }
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
