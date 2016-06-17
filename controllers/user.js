var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.findUserById = function(_userId, callback) {
  db.User.findOne({
    _id: _userId
  }, callback)
}

exports.findUserByName = function(username, callback) {
  db.User.findOne({
    username: username
  }, callback)
}

exports.findUserByEmail = function(email, callback) {
  db.User.findOne({
    email: email
  }, callback)
}

exports.createUser = function(username, email, password, callback) {
  user = new db.User
  user.username = username
  user.email = email
  user.password = password
  user.avatarUrl = gravatar.url(email)
  user.online = false
  user.save(callback)
}

exports.checkPassword = function(username, password, callback) {
  db.User.findOne({
    username: username
  }, function(err, user) {
    if (user) {
      if (user.password == password) {
        callback(null, user)
      } else {
        callback(2, null)
      }
    } else {
      callback(1, null)
    }
  })
}

// exports.findUserByNameEmailOrCreate = function(username, email, password, callback) {
//   db.User.findOne({
//     $or: [
//       {username: username},
//       {email: email}
//     ]
//   }, function(err, user) {
//     if (user) {
//       callback(1, user)
//     } else {
//       user = new db.User
//       user.username = username
//       user.email = email
//       user.password = password
//       user.avatarUrl = gravatar.url(email)
//       user.save(callback)
//     }
//   })
// }
//
// exports.findByEmailOrCreate = function(email, callback) {
//   db.User.findOne({
//     email: email
//   }, function(err, user) {
//     if (user) {
//       callback(null, user)
//     } else {
//       user = new db.User
//       user.name = email.split('@')[0]
//       user.email = email
//       user.avatarUrl = gravatar.url(email)
//       user.save(callback)
//     }
//   })
// }

exports.online = function(_userId, callback) {
  db.User.findOneAndUpdate({
    _id: _userId
  }, {
    $set: {
      online: true
    }
  }, callback)
}

exports.offline = function(_userId, callback) {
  db.User.findOneAndUpdate({
    _id: _userId
  }, {
    $set: {
      online: false
    }
  }, callback)
}

exports.getOnlineUsers = function(callback) {
  db.User.find({
    online: true
  }, callback)
}
