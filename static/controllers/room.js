var t

angular.module('webchatApp').controller('RoomCtrl', function($scope, socket) {
  socket.on('roomData', function(room) {
    $scope.room = room
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
  //$scope.messages = []
  //socket.emit('getAllMessages')
  //
  // socket.on('allMessages', function(messages) {
  //   $scope.messages = messages
  // })
  socket.on('messageAdded', function(message) {
    $scope.room.messages.push(message)
  })
  socket.emit('getRoom')
  t = socket
  setInterval("t.emit('getRoom')", 5000)
})
