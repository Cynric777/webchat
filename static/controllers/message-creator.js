angular.module('webchatApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.newMessage = ''
  $scope.createMessage = function() {
    socket.emit('createMessage', {
      message: $scope.newMessage,
      creator: $scope.me
    })
    $scope.newMessage = ''
  }
})
