var loopSocket, username

angular.module('webchatApp').controller('RoomCtrl', function($scope, socket) {
  socket.on('roomData', function(room) {
    if (_.isEqual($scope.room, room) == false) {
      $scope.room = room
    }
  })
  socket.on('applyData', function(applyArray) {
    $scope.$parent.me.applyNumber = applyArray.length
    if (_.isEqual($scope.$parent.me.applyArray, applyArray) == false) {
      $scope.$parent.me.applyArray = applyArray
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
  socket.emit('getApply', username)
  loopSocket = socket
  setInterval("loopSocket.emit('getRoom'); loopSocket.emit('getApply', username)", 5000)
})
