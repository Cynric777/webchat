var searchUsername
angular.module('webchatApp').controller('UserSearchCtrl', function($scope, socket) {
  socket.on('searchResult', function(result) {
    if (result.result == true) {
      $scope.userExist = result
      $("#resultTitle").html("找到&nbsp1&nbsp个人")
    } else {
      $scope.userExist = null
      $("#resultTitle").html("用户不存在")
    }
    $("#searchResultModal").modal("show")
  })
  $scope.search = function() {
    if($scope.searchUsername) {
      searchUsername = $scope.searchUsername
      socket.emit('search', $scope.searchUsername)
    }
  }
  $scope.sendApplyForFriend = function() {
    if(searchUsername) {
      socket.emit('apply', {
        target: searchUsername,
        sponsor: $scope.$parent.me.username
      })
      $("#searchResultModal").modal("hide")
    }
  }
})
