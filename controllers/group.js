var db = require('../models')

exports.createGroup = function(groupname, username, callback) {
  group = new db.Group
  group.host = username
  group.guest = null
  group.avatarUrl = null
  group.groupname = groupname
  group.save()
}

exports.addFriend = function(apply, avatarUrlOfHost, avatarUrlOfGuest, callback) {
  group = new db.Group
  group.host = apply.host
  group.guest = apply.guest
  group.avatarUrl = avatarUrlOfGuest
  group.groupname = "我的好友"
  group.save()
  group = new db.Group
  group.host = apply.guest
  group.guest = apply.host
  group.avatarUrl = avatarUrlOfHost
  group.groupname = "我的好友"
  group.save()
}

exports.findGroupByHost = function(host, callback) {
  db.Group.find({
    host: host
  }, callback)
}

exports.updateAvatarUrl = function(username, avatarUrl, callback) {
  db.Group.update({
    guest: username
  }, {
    $set: {
      avatarUrl: avatarUrl
    }
  }, {
    multi: true
  }, callback)
}
exports.updateGroupname = function(host, guest, groupname, callback) {
  db.Group.findOneAndUpdate({
    host: host,
    guest: guest
  }, {
    $set: {
      groupname: groupname
    }
  }, callback)
}

exports.deleteFriend = function(host, guest, callback) {
  db.Group.findOneAndRemove({
    host: host,
    guest: guest
  }, callback)
}
