var loopSocket, username

angular.module('webchatApp').controller('RoomCtrl', function($scope, socket) {
  socket.on('roomData', function(room) {
    if (_.isEqual($scope.room, room) == false) {
      $scope.room = room
    }
  })

  socket.on('applyData', function(applyArray) {
    $scope.$parent.me.applyNumber = applyArray.length
    var _applyArray, _agreeArray, _refuseArray
    _applyArray = applyArray.filter(function(apply) {
      return apply.sponsor == false
    })
    _agreeArray = applyArray.filter(function(apply) {
      return (apply.sponsor == true && apply.result == true)
    })
    _refuseArray = applyArray.filter(function(apply) {
      return (apply.sponsor == true && apply.result == false)
    })
    if (_.isEqual($scope.$parent.me.applyArray, _applyArray) == false) {
      $scope.$parent.me.applyArray = _applyArray
    }
    if (_.isEqual($scope.$parent.me.agreeArray, _agreeArray) == false) {
      $scope.$parent.me.agreeArray = _agreeArray
    }
    if (_.isEqual($scope.$parent.me.refuseArray, _refuseArray) == false) {
      $scope.$parent.me.refuseArray = _refuseArray
    }
  })

  socket.on('friendData', function(friendArray) {
    var groupArray
    groupArray = _.toArray(_.groupBy(friendArray, function(friend) {
      return friend.groupname
    }))
    console.log(groupArray)
    if (_.isEqual($scope.groupArray, groupArray) == false) {
      $scope.groupArray = groupArray
    }
  })

  socket.on('online', function(user) {
    $scope.room.users.push(user)
  })

  socket.on('offline', function(user) {
    _userId = user._id
    $scope.room.users = $scope.room.users.filter(function(user) {
      return user._id != _userId
    })
  })

  socket.on('messageAdded', function(message) {
    $scope.room.messages.push(message)
  })

  username = $scope.$parent.me.username
  socket.emit('getRoom')
  socket.emit('getFriend', username)
  socket.emit('getApply', username)
  loopSocket = socket
  setInterval("loopSocket.emit('getRoom'); loopSocket.emit('getApply', username); loopSocket.emit('getFriend', username)", 5000)
})
