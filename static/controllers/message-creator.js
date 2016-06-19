angular.module('webchatApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.newMessage = ''
  $scope.createMessage = function() {
    socket.emit('createMessage', {
      message: $scope.newMessage,
      sender: $scope.me.username,
      receiver: $scope.$parent.chat.friend,
      avatarUrl: $scope.me.avatarUrl
    })
    $scope.newMessage = ''
  }
})
