angular.module('webchatApp').controller('ChangeGroupCtrl', function($scope, socket) {
  $scope.moveFriend = function() {
    socket.emit('changeGroup', {
      host: $scope.$parent.$parent.me.username,
      guest: $scope.$parent.select,
      groupname: $("#selectGroupname").val()
    })
    $("#changeGroupModal").modal("hide")
  }
  $scope.deleteFriend = function() {
    socket.emit('deleteFriend', {
      host: $scope.$parent.$parent.me.username,
      guest: $scope.$parent.select
    })
    $("#changeGroupModal").modal("hide")
  }
})
