angular.module('webchatApp').controller('LoginCtrl', function($scope, $http, $location) {
  $scope.login = function() {
    $http({
      url: '/api/login',
      method: 'POST',
      data: {
        email: $scope.email
      }
    }).then(function successCallback(user) {
      console.log("成功登陆")
      $scope.$emit('login', user.data)
      $location.path('/')
    }, function errorCallback(data) {
      $location.path('/login')
    })
  }
})
