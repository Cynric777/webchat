angular.module('webchatApp').controller('AddGroupCtrl', function($scope, socket) {
  $scope.createGroup = function() {
    socket.emit("group", {
      username: $scope.$parent.$parent.me.username,
      groupname: $("#newGroupname").val()
    })
    $("#addGroupModal").modal("hide")
    $("#newGroupname").val(null)
  }
})
